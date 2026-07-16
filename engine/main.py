"""
Vertex Red — Matching Engine FastAPI Server
Thaw Ye Zaw — Backend / Database Domain

Start with: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from matching import match_donors
from models import MatchRequest, MatchResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown hooks."""
    print("[matching-engine] started on :8000")
    yield


app = FastAPI(
    title="Vertex Red — Matching Engine",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/match", response_model=MatchResponse)
async def match(req: MatchRequest):
    """Score and rank donors for a blood request."""
    if not req.donors:
        return MatchResponse(donors=[], total_scored=0, total_filtered=0)

    ranked, scored, filtered = match_donors(
        request_id=req.request_id,
        blood_type=req.blood_type,
        lat=req.location.lat,
        lng=req.location.lng,
        urgency=req.urgency,
        donors=req.donors,
    )

    return MatchResponse(donors=ranked, total_scored=scored, total_filtered=filtered)
