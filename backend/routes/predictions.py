
from fastapi import APIRouter
from pathlib import Path
import csv

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_DIR = BASE_DIR / "datasets" / "processed"


def inspect_csv(filename):
    file_path = PROCESSED_DIR / filename

    if not file_path.exists():
        return {
            "available": False,
            "records": 0
        }

    try:
        with open(file_path, "r", encoding="utf-8-sig") as file:
            records = list(csv.DictReader(file))

        return {
            "available": True,
            "records": len(records)
        }

    except (OSError, csv.Error):
        return {
            "available": False,
            "records": 0
        }


@router.get("/status")
def get_prediction_status():

    schools = inspect_csv("schools_clean.csv")
    hospitals = inspect_csv("hospitals_clean.csv")
    ward_schools = inspect_csv("ward_school_counts.csv")

    population_available = any(
        (PROCESSED_DIR / filename).exists()
        for filename in [
            "population_clean.csv",
            "population_by_district.csv",
            "population_by_taluk.csv"
        ]
    )

    infrastructure_available = (
        schools["available"] and hospitals["available"]
    )

    return {
        "module": "AI Predictions",

        "status": (
            "data_ready_for_exploration"
            if infrastructure_available
            else "awaiting_datasets"
        ),

        "model_trained": False,

        "dataset_inventory": {
            "schools": schools,
            "private_hospitals": hospitals,
            "ward_school_counts": ward_schools,
            "population_data_available": population_available
        },

        "prediction_capabilities": {
            "population_forecasting": False,
            "infrastructure_demand_prediction": False,
            "machine_learning_model": False,
            "hypothetical_scenario_analysis": True
        },

        "requirements_for_ml": [
            "Reliable historical population data",
            "Time-based population observations",
            "Verified infrastructure inventory",
            "Suitable historical training data",
            "Model training and evaluation"
        ],

        "message": (
            "Infrastructure datasets are available for analysis. "
            "Actual machine learning predictions require "
            "historical population and training data."
        )
    }
