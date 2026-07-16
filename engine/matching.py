"""
Vertex Red — Donor-to-Request Matching Engine
Thaw Ye Zaw — Backend / Database Domain

Scoring model (100-point scale):
  Blood Type  — 40 pts  (exact = 40, compatible = 25, incompatible = filtered)
  Distance    — 35 pts  (decays linearly with distance)
  Medical     — 25 pts  (base 25, penalties for recent donation or low weight)
"""

from __future__ import annotations

import math
from datetime import date, datetime, timedelta

from models import BloodType, DonorProfile, DonorResult, Urgency

# ---------------------------------------------------------------------------
# Blood-type compatibility matrix (donor → compatible recipients)
# ---------------------------------------------------------------------------

COMPATIBLE_RECIPIENTS: dict[BloodType, frozenset[BloodType]] = {
    "O-":  frozenset({"O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"}),
    "O+":  frozenset({"O+", "A+", "B+", "AB+"}),
    "A-":  frozenset({"A-", "A+", "AB-", "AB+"}),
    "A+":  frozenset({"A+", "AB+"}),
    "B-":  frozenset({"B-", "B+", "AB-", "AB+"}),
    "B+":  frozenset({"B+", "AB+"}),
    "AB-": frozenset({"AB-", "AB+"}),
    "AB+": frozenset({"AB+"}),
}

# ---------------------------------------------------------------------------
# Distance thresholds by urgency (km)
# ---------------------------------------------------------------------------

MAX_RADIUS: dict[Urgency, float] = {
    "STANDARD": 50.0,
    "URGENT":   75.0,
    "CRITICAL": 100.0,
}

# Minimum weight in kg to be eligible
MIN_WEIGHT_KG = 45.0

# Donation deferral thresholds (days)
MIN_DONATION_INTERVAL_DAYS = 56
EXTENDED_DEFERRAL_DAYS = 90

# Medical conditions that disqualify a donor
DISQUALIFYING_CONDITIONS = frozenset({
    "hiv", "aids", "hepatitis b", "hepatitis c",
    "syphilis", "malaria", "tuberculosis", "cancer",
    "heart disease", "hemophilia", "sickle cell",
})

# ---------------------------------------------------------------------------
# Scoring constants
# ---------------------------------------------------------------------------

BLOOD_TYPE_MAX = 40
BLOOD_EXACT = 40
BLOOD_COMPATIBLE = 25

DISTANCE_MAX = 35

MEDICAL_MAX = 25
PENALTY_SHORT_DEFERRAL = 15   # < 56 days
PENALTY_EXTENDED_DEFERRAL = 5  # 56-90 days

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate great-circle distance in km between two lat/lng points."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _days_since(date_str: str | None) -> int | None:
    """Return days since a date string, or None if parseable."""
    if not date_str:
        return None
    try:
        d = date.fromisoformat(date_str)
        return (date.today() - d).days
    except (ValueError, TypeError):
        return None


def _is_disqualified(donor: DonorProfile) -> str | None:
    """
    Check hard disqualification rules.
    Returns a reason string if disqualified, None otherwise.
    """
    # Missing location
    if donor.lat is None or donor.lng is None:
        return "missing_location"

    # Weight too low
    if donor.weight_kg is not None and donor.weight_kg < MIN_WEIGHT_KG:
        return f"underweight ({donor.weight_kg}kg < {MIN_WEIGHT_KG}kg)"

    # Disqualifying medical condition
    for condition in donor.medical_conditions:
        if condition.lower().strip() in DISQUALIFYING_CONDITIONS:
            return f"medical_condition ({condition})"

    return None


# ---------------------------------------------------------------------------
# Scoring functions
# ---------------------------------------------------------------------------


def score_blood_type(donor_type: BloodType, request_type: BloodType) -> int:
    """Score blood type compatibility. Incompatible return 0."""
    if donor_type == request_type:
        return BLOOD_EXACT
    if request_type in COMPATIBLE_RECIPIENTS.get(donor_type, frozenset()):
        return BLOOD_COMPATIBLE
    return 0


def score_distance(distance_km: float, max_radius: float) -> float:
    """
    Linear decay: 35 at 0 km → 0 at max_radius.
    Clamped to [0, 35].
    """
    if distance_km <= 0:
        return float(DISTANCE_MAX)
    score = DISTANCE_MAX * (1.0 - distance_km / max_radius)
    return max(0.0, min(float(DISTANCE_MAX), score))


def score_medical(donor: DonorProfile) -> int:
    """Score medical eligibility with penalties for recent donation."""
    score = MEDICAL_MAX
    days = _days_since(donor.last_donation_date)
    if days is not None:
        if days < MIN_DONATION_INTERVAL_DAYS:
            score -= PENALTY_SHORT_DEFERRAL
        elif days < EXTENDED_DEFERRAL_DAYS:
            score -= PENALTY_EXTENDED_DEFERRAL
    return max(0, score)


def score_donor(
    donor: DonorProfile,
    request_blood_type: BloodType,
    request_lat: float,
    request_lng: float,
    max_radius: float,
) -> tuple[float, int]:
    """
    Compute distance (km) and total compatibility score (0-100) for a donor.
    Returns (distance_km, total_score).
    """
    distance = _haversine_km(donor.lat, donor.lng, request_lat, request_lng)  # type: ignore[arg-type]

    blood_score = score_blood_type(donor.blood_type, request_blood_type)
    if blood_score == 0:
        return distance, 0

    dist_score = score_distance(distance, max_radius)
    med_score = score_medical(donor)

    total = int(round(blood_score + dist_score + med_score))
    return round(distance, 1), total


# ---------------------------------------------------------------------------
# Main entry-point
# ---------------------------------------------------------------------------


def match_donors(
    request_id: str,
    blood_type: BloodType,
    lat: float,
    lng: float,
    urgency: Urgency,
    donors: list[DonorProfile],
    top_n: int = 20,
) -> tuple[list[DonorResult], int, int]:
    """
    Score, filter, and rank donors for a blood request.

    Returns (results, total_scored, total_filtered).
    """
    max_radius = MAX_RADIUS[urgency]
    results: list[DonorResult] = []
    filtered = 0

    for donor in donors:
        # 1. Hard disqualification
        reason = _is_disqualified(donor)
        if reason:
            filtered += 1
            continue

        # 2. Blood type compatibility
        if not score_blood_type(donor.blood_type, blood_type):
            filtered += 1
            continue

        # 3. Distance + full scoring
        distance_km, total_score = score_donor(
            donor, blood_type, lat, lng, max_radius,
        )

        # 4. Exclude donors beyond max radius
        if distance_km > max_radius:
            filtered += 1
            continue

        results.append(DonorResult(
            id=donor.id,
            full_name=donor.full_name,
            phone=donor.phone,
            blood_type=donor.blood_type,
            township=donor.township,
            distance_km=distance_km,
            compatibility_score=total_score,
            lat=donor.lat,
            lng=donor.lng,
        ))

    # Sort by score descending, then distance ascending
    results.sort(key=lambda r: (-r.compatibility_score, r.distance_km))

    total_scored = len(results)
    return results[:top_n], total_scored, filtered
