
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pathlib import Path
from functools import lru_cache
import json
import csv

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "datasets" / "processed"


@lru_cache(maxsize=3)
def load_geojson(filename: str):
    file_path = DATA_DIR / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Dataset not found: {filename}"
        )

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return json.load(file)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid GeoJSON file: {filename}"
        )


@lru_cache(maxsize=5)
def load_csv(filename: str):
    file_path = DATA_DIR / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Dataset not found: {filename}"
        )

    with open(file_path, "r", encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def normalize(value: str) -> str:
    return " ".join(str(value or "").strip().lower().split())


@router.get("/layers")
def get_map_layers():
    return {
        "module": "City Mapping",
        "available_layers": ["state", "districts", "taluks", "schools"],
        "data_status": "geospatial_datasets_ready"
    }


@router.get("/state")
def get_state_boundary():
    return JSONResponse(content=load_geojson("state.geojson"))


@router.get("/districts")
def get_district_boundaries():
    return JSONResponse(content=load_geojson("districts.geojson"))


@router.get("/taluks")
def get_taluk_boundaries(
    district_code: str = Query(..., description="KGIS district code")
):
    all_taluks = load_geojson("taluks.geojson")

    filtered_features = [
        feature
        for feature in all_taluks.get("features", [])
        if str(feature.get("properties", {}).get("KGISDistri", "")).strip()
        == district_code.strip()
    ]

    return JSONResponse(content={
        **all_taluks,
        "features": filtered_features
    })


@router.get("/infrastructure")
def get_infrastructure(
    district: str = Query(...),
    taluk: str = Query(default="")
):
    district_key = normalize(district).upper()
    taluk_key = normalize(taluk).upper()

    district_rows = load_csv("hospitals_by_district.csv")
    taluk_rows = load_csv("hospitals_by_taluk.csv")

    district_match = next(
        (
            row for row in district_rows
            if normalize(row.get("district")).upper() == district_key
        ),
        None
    )

    taluk_match = None

    if taluk_key:
        taluk_match = next(
            (
                row for row in taluk_rows
                if normalize(row.get("district")).upper() == district_key
                and normalize(row.get("taluk")).upper() == taluk_key
            ),
            None
        )

    return {
        "district": district,
        "taluk": taluk or None,
        "hospitals": {
            "district_count": int(district_match["hospital_count"])
            if district_match else None,
            "taluk_count": int(taluk_match["hospital_count"])
            if taluk_match else None
        },
        "data_availability": {
            "district_hospitals": district_match is not None,
            "taluk_hospitals": (
                taluk_match is not None if taluk else None
            )
        }
    }


@router.get("/schools")
def get_school_statistics(district: str = Query(...)):
    district_key = normalize(district)

    rows = load_csv("schools_clean.csv")

    # Match verified source dataset naming conventions.
    # Bengaluru South is intentionally excluded because
    # its school records cannot currently be reliably matched.
    aliases = {
        "bengaluru (rural)": ["bangalore rural"],
        "bengaluru rural": ["bangalore rural"],
        "bengaluru (urban)": [
            "bangalore u north",
            "bangalore u south",
            "bangalore"
        ],
        "bengaluru urban": [
            "bangalore u north",
            "bangalore u south",
            "bangalore"
        ],
    }

    accepted_names = aliases.get(district_key, [district_key])

    matching_rows = [
        row for row in rows
        if normalize(row.get("district")) in accepted_names
    ]

    return {
        "district": district,
        "school_count": len(matching_rows) if matching_rows else None,
        "data_available": bool(matching_rows),
        "coverage_note": (
            "Count from available school location dataset."
            if matching_rows
            else "School data is unavailable for this district."
        )
    }


@router.get("/school-locations")
def get_school_locations(district: str = Query(...)):
    district_key = normalize(district)

    rows = load_csv("schools_clean.csv")

    # Keep school location aliases consistent with school statistics.
    aliases = {
        "bengaluru (rural)": ["bangalore rural"],
        "bengaluru rural": ["bangalore rural"],
        "bengaluru (urban)": [
            "bangalore u north",
            "bangalore u south",
            "bangalore"
        ],
        "bengaluru urban": [
            "bangalore u north",
            "bangalore u south",
            "bangalore"
        ],
    }

    accepted_names = aliases.get(district_key, [district_key])

    locations = []

    for row in rows:
        if normalize(row.get("district")) not in accepted_names:
            continue

        try:
            latitude = float(row["latitude"])
            longitude = float(row["longitude"])
        except (ValueError, TypeError, KeyError):
            continue

        if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
            continue

        locations.append({
            "school_id": row.get("school_id"),
            "school_name": row.get("school_name"),
            "category": row.get("category"),
            "management": row.get("management"),
            "latitude": latitude,
            "longitude": longitude
        })

    return {
        "district": district,
        "count": len(locations),
        "locations": locations
    }
