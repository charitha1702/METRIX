
import csv
from pathlib import Path
from collections import Counter

from fastapi import APIRouter

router = APIRouter()

# Dataset directory
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "datasets" / "processed"


def read_dataset(filename):
    """Read a processed CSV dataset."""
    file_path = DATA_DIR / filename

    if not file_path.exists():
        return []

    with open(file_path, "r", encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def count_values(records, column):
    """Count records grouped by a column."""
    counts = Counter(
        row.get(column, "").strip()
        for row in records
        if row.get(column, "").strip()
    )

    return [
        {"name": name, "count": count}
        for name, count in counts.most_common()
    ]


@router.get("/overview")
def get_infrastructure_overview():

    # Load datasets
    schools = read_dataset("schools_clean.csv")
    wards = read_dataset("ward_school_counts.csv")
    hospitals = read_dataset("hospitals_clean.csv")

    # School records with coordinates
    schools_with_coordinates = [
        school for school in schools
        if school.get("latitude") and school.get("longitude")
    ]

    # School distributions
    school_categories = count_values(schools, "category")
    school_management = count_values(schools, "management")
    school_blocks = count_values(schools, "block")

    # Ward-wise government school statistics
    total_government_schools = sum(
        int(row.get("government_schools", 0) or 0)
        for row in wards
    )

    # Hospital distributions
    hospital_districts = count_values(hospitals, "district")
    hospital_taluks = count_values(hospitals, "taluk")

    return {
        "module": "Infrastructure Analysis",

        # THIS IS THE NEW STATUS
        "data_status": "processed_datasets_available",

        "summary": {
            "school_records": len(schools),
            "schools_with_coordinates": len(schools_with_coordinates),
            "schools_without_coordinates": (
                len(schools) - len(schools_with_coordinates)
            ),
            "ward_records": len(wards),
            "government_schools_in_ward_dataset": (
                total_government_schools
            ),
            "private_hospital_records": len(hospitals),
            "hospital_districts": len(hospital_districts),
            "hospital_taluk_combinations": len(hospital_taluks)
        },

        "schools": {
            "by_category": school_categories,
            "by_management": school_management,
            "by_block": school_blocks
        },

        "ward_school_counts": wards,

        "hospitals": {
            "by_district": hospital_districts,
            "by_taluk": hospital_taluks
        },

        "data_limitations": [
            "School records come from the available BBMP school inventory.",
            "School coordinates have passed a broad geographic validation check.",
            "Hospital records do not contain geographic coordinates or bed capacity.",
            "Hospital counts represent records in the supplied dataset, not verified current operating totals.",
            "Population baselines are not yet integrated, so infrastructure gaps cannot be conclusively established."
        ]
    }
