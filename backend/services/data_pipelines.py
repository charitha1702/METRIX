
import csv
import re
from pathlib import Path
from collections import Counter

# Dataset directories
BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "datasets" / "raw"
PROCESSED_DIR = BASE_DIR / "datasets" / "processed"

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


# Read CSV files with different possible encodings
def read_csv(filename):
    file_path = RAW_DIR / filename

    for encoding in ["utf-8-sig", "cp1252", "latin1"]:
        try:
            with open(
                file_path,
                "r",
                encoding=encoding,
                newline=""
            ) as file:

                reader = csv.DictReader(file)

                # Standardize column names
                headers = [
                    h.strip() if h else h
                    for h in reader.fieldnames
                ]

                rows = []

                for original in reader:
                    row = {}

                    for key, value in original.items():
                        clean_key = key.strip() if key else key

                        if clean_key is not None:
                            row[clean_key] = (
                                value.strip()
                                if isinstance(value, str)
                                else value
                            )

                    rows.append(row)

                return rows

        except UnicodeDecodeError:
            continue

    raise ValueError(f"Unable to read {filename}")


# Save processed data
def save_csv(filename, rows, columns):
    output_path = PROCESSED_DIR / filename

    with open(
        output_path,
        "w",
        encoding="utf-8",
        newline=""
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=columns
        )

        writer.writeheader()
        writer.writerows(rows)

    print(f"Saved: {output_path}")


# Validate coordinates and extract longitude/latitude
def extract_coordinates(value):
    if not value:
        return None, None

    match = re.search(
        r"POINT\s*\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)",
        str(value),
        re.IGNORECASE
    )

    if not match:
        return None, None

    longitude = float(match.group(1))
    latitude = float(match.group(2))

    # Broad Karnataka geographic bounds
    if not (74 <= longitude <= 78.5):
        return None, None

    if not (11.5 <= latitude <= 18.5):
        return None, None

    return longitude, latitude


# --------------------------------------------------
# 1. CLEAN SCHOOL DATA
# --------------------------------------------------

def clean_schools():
    print("\nCleaning school dataset...")

    rows = read_csv("BBMP SCHOOL.csv")

    cleaned = []
    seen_ids = set()

    for row in rows:
        school_id = row.get("DISE id", "").strip()
        school_name = row.get("School Name", "").strip()

        if not school_id or not school_name:
            continue

        if school_id in seen_ids:
            continue

        longitude, latitude = extract_coordinates(
            row.get("Coordinates", "")
        )

        seen_ids.add(school_id)

        cleaned.append({
            "school_id": school_id,
            "school_name": school_name,
            "management": row.get("Management", "").strip(),
            "medium": row.get("Medium of Instruction", "").strip(),
            "category": row.get("Category", "").strip(),
            "sex": row.get("Sex", "").strip(),
            "cluster": row.get("Cluster", "").strip(),
            "block": row.get("Block", "").strip(),
            "district": row.get("District", "").strip(),
            "school_type": row.get("School Type", "").strip(),
            "pincode": row.get("Pincode", "").strip(),
            "address": row.get("Address", "").strip(),
            "landmark": row.get("Landmark", "").strip(),
            "longitude": longitude if longitude is not None else "",
            "latitude": latitude if latitude is not None else ""
        })

    columns = [
        "school_id",
        "school_name",
        "management",
        "medium",
        "category",
        "sex",
        "cluster",
        "block",
        "district",
        "school_type",
        "pincode",
        "address",
        "landmark",
        "longitude",
        "latitude"
    ]

    save_csv("schools_clean.csv", cleaned, columns)

    mapped = sum(
        1 for row in cleaned
        if row["longitude"] != ""
    )

    print("Total unique schools:", len(cleaned))
    print("Schools with valid Karnataka coordinates:", mapped)
    print("Schools without valid coordinates:", len(cleaned) - mapped)


# --------------------------------------------------
# 2. CLEAN WARD SCHOOL COUNTS
# --------------------------------------------------

def clean_ward_counts():
    print("\nCleaning ward school counts...")

    rows = read_csv("NUMBER OF SCHOOLS BY WARD.csv")

    cleaned = []

    for row in rows:
        ward_no = row.get("Ward_No", "").strip()
        ward_name = row.get("Ward Name", "").strip()
        raw_count = row.get("Govt Schools #", "").strip()

        # Remove summary rows and incomplete ward records
        if not ward_no or not ward_name:
            continue

        if ward_name.lower() == "total":
            continue

        try:
            school_count = int(raw_count)
        except (ValueError, TypeError):
            continue

        if school_count < 0:
            continue

        cleaned.append({
            "ward_no": ward_no,
            "ward_name": ward_name,
            "government_schools": school_count
        })

    columns = [
        "ward_no",
        "ward_name",
        "government_schools"
    ]

    save_csv("ward_school_counts.csv", cleaned, columns)

    print("Valid ward records:", len(cleaned))
    print(
        "Total recorded government schools:",
        sum(row["government_schools"] for row in cleaned)
    )


# --------------------------------------------------
# 3. CLEAN HOSPITAL DATA AND AGGREGATE
# --------------------------------------------------

def clean_hospitals():
    print("\nCleaning hospital dataset...")

    rows = read_csv(
        "District Wise Private Hospitals in Karnataka.csv"
    )

    cleaned = []
    district_counts = Counter()
    taluk_counts = Counter()

    for row in rows:
        hospital_name = row.get("HOSPITAL", "").strip()
        district = row.get("DISTRICT", "").strip().upper()
        taluk = row.get("TALUK", "").strip().upper()

        # Skip completely empty or incomplete records
        if not hospital_name or not district or not taluk:
            continue

        cleaned.append({
            "hospital_name": hospital_name,
            "taluk": taluk,
            "district": district
        })

        district_counts[district] += 1
        taluk_counts[(district, taluk)] += 1

    # District-level aggregation
    district_rows = [
        {
            "district": district,
            "hospital_count": count
        }
        for district, count in sorted(district_counts.items())
    ]

    # Taluk-level aggregation
    taluk_rows = [
        {
            "district": district,
            "taluk": taluk,
            "hospital_count": count
        }
        for (district, taluk), count in sorted(taluk_counts.items())
    ]

    save_csv(
        "hospitals_clean.csv",
        cleaned,
        ["hospital_name", "taluk", "district"]
    )

    save_csv(
        "hospitals_by_district.csv",
        district_rows,
        ["district", "hospital_count"]
    )

    save_csv(
        "hospitals_by_taluk.csv",
        taluk_rows,
        ["district", "taluk", "hospital_count"]
    )

    print("Valid hospital records:", len(cleaned))
    print("Districts:", len(district_rows))
    print("District-taluk combinations:", len(taluk_rows))


# --------------------------------------------------
# RUN ALL PIPELINES
# --------------------------------------------------

def run_all_pipelines():
    print("\n===================================")
    print("       METRIX DATA PIPELINE")
    print("===================================")

    clean_schools()
    clean_ward_counts()
    clean_hospitals()

    print("\n===================================")
    print(" ALL DATASETS PROCESSED!")
    print("===================================")


if __name__ == "__main__":
    run_all_pipelines()
