"""
Vertex Red — Matching Engine Data Models
Thaw Ye Zaw — Backend / Database Domain
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

BloodType = Literal["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
Urgency = Literal["CRITICAL", "URGENT", "STANDARD"]

# ---------------------------------------------------------------------------
# Request / Response
# ---------------------------------------------------------------------------


class Location(BaseModel):
    lat: float
    lng: float


class DonorProfile(BaseModel):
    """Minimal donor record received from the Next.js API route."""

    id: str
    full_name: str
    phone: str | None = None
    blood_type: BloodType
    township: str | None = None
    lat: float | None = None
    lng: float | None = None
    last_donation_date: str | None = None
    weight_kg: float | None = None
    medical_conditions: list[str] = Field(default_factory=list)


class MatchRequest(BaseModel):
    """Payload sent from /api/match-donors to the Python engine."""

    request_id: str
    blood_type: BloodType
    location: Location
    urgency: Urgency
    donors: list[DonorProfile]


class DonorResult(BaseModel):
    """A single ranked donor in the response."""

    id: str
    full_name: str
    phone: str | None = None
    blood_type: BloodType
    township: str | None = None
    distance_km: float
    compatibility_score: int
    lat: float | None = None
    lng: float | None = None


class MatchResponse(BaseModel):
    """Response returned by the Python engine."""

    donors: list[DonorResult]
    total_scored: int
    total_filtered: int
