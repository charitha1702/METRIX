
from fastapi import APIRouter
from pathlib import Path
import json

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_DIR = BASE_DIR / "datasets" / "processed"


def get_geojson_feature_count(filename: str):
    file_path = PROCESSED_DIR / filename

    if not file_path.exists():
        return 0

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        return len(data.get("features", []))

    except (json.JSONDecodeError, OSError):
        return 0


@router.get("/overview")
def get_growth_overview():

    districts = get_geojson_feature_count("districts.geojson")
    taluks = get_geojson_feature_count("taluks.geojson")

    return {
        "module": "Growth Analysis",

        "data_status": "awaiting_population_datasets",

        "geographical_coverage": {
            "state": "Karnataka",
            "districts_available": districts,
            "taluks_available": taluks
        },

        "population_analysis": {
            "available": False,
            "historical_population": None,
            "current_population": None,
            "projected_population": None,
            "growth_rate": None
        },

        "analysis_readiness": {
            "geographical_data": districts > 0 and taluks > 0,
            "population_data": False,
            "growth_calculations": False
        },

        "message": (
            "Geographical datasets are available. "
            "Population datasets are required before "
            "real population growth analysis can be performed."
        )
    }
