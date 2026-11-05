
import csv
import re
from pathlib import Path

DATA_DIR = Path(__file__).parent / "backend" / "datasets" / "raw"


def read_csv(filename):
    path = DATA_DIR / filename

    for encoding in ["utf-8-sig", "cp1252", "latin1"]:
        try:
            with open(path, "r", encoding=encoding, newline="") as f:
                sample = f.read(8192)
                f.seek(0)

                try:
                    dialect = csv.Sniffer().sniff(sample)
                except csv.Error:
                    dialect = csv.excel

                reader = csv.DictReader(f, dialect=dialect)
                headers = [
                    h.strip() if h else h
                    for h in (reader.fieldnames or [])
                ]

                rows = []
                for original in reader:
                    row = {}
                    for key, value in original.items():
                        clean_key = key.strip() if key else key
                        row[clean_key] = value
                    rows.append(row)

                return headers, rows, encoding

        except UnicodeDecodeError:
            continue

    raise ValueError(f"Could not decode {filename}")


# 1. Compare school datasets
primary_headers, primary, _ = read_csv("BBMP PRIMARY SCHOOL.csv")
school_headers, schools, _ = read_csv("BBMP SCHOOL.csv")

primary_ids = {
    str(row.get("schoolid", "")).strip()
    for row in primary
    if str(row.get("schoolid", "")).strip()
}

school_ids = {
    str(row.get("DISE id", "")).strip()
    for row in schools
    if str(row.get("DISE id", "")).strip()
}

overlap = primary_ids & school_ids

print("\n========== SCHOOL DATASET COMPARISON ==========")
print("Primary school records:", len(primary))
print("BBMP school records:", len(schools))
print("Unique primary school IDs:", len(primary_ids))
print("Unique BBMP school IDs:", len(school_ids))
print("Overlapping IDs:", len(overlap))
print("IDs only in primary dataset:", len(primary_ids - school_ids))
print("IDs only in BBMP dataset:", len(school_ids - primary_ids))


# 2. Check coordinates
def valid_point(value):
    if not value:
        return False

    match = re.search(
        r"POINT\s*\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)",
        str(value),
        re.IGNORECASE
    )

    if not match:
        return False

    longitude = float(match.group(1))
    latitude = float(match.group(2))

    return -180 <= longitude <= 180 and -90 <= latitude <= 90


print("\n========== COORDINATE CHECK ==========")

for filename, rows, column in [
    ("BBMP PRIMARY SCHOOL.csv", primary, "latlong"),
    ("BBMP SCHOOL.csv", schools, "Coordinates")
]:
    valid = sum(valid_point(row.get(column)) for row in rows)
    print(filename)
    print("Valid coordinates:", valid)
    print("Missing/invalid coordinates:", len(rows) - valid)


# 3. Check malformed CSV rows in primary school file
_, raw_primary, _ = read_csv("BBMP PRIMARY SCHOOL.csv")

print("\n========== PRIMARY SCHOOL ROW CHECK ==========")
malformed = [
    (i, row)
    for i, row in enumerate(raw_primary, start=2)
    if None in row
]

print("Rows with extra/unexpected fields:", len(malformed))

for row_number, row in malformed[:5]:
    print("Row", row_number, ":", row)


# 4. Inspect hospital dataset
print("\n========== HOSPITAL DATASET ==========")

headers, hospitals, encoding = read_csv(
    "District Wise Private Hospitals in Karnataka.csv"
)

print("Encoding used:", encoding)
print("Rows:", len(hospitals))
print("Columns:", len(headers))
print("Column names:", headers)

print("\nFirst 10 hospital records:")
for row in hospitals[:10]:
    print(row)

print("\nMissing values:")
for column in headers:
    missing = sum(
        1 for row in hospitals
        if not str(row.get(column, "") or "").strip()
    )
    if missing:
        print(column, ":", missing)


# 5. Inspect ward school counts
print("\n========== WARD SCHOOL COUNTS ==========")

_, wards, _ = read_csv("NUMBER OF SCHOOLS BY WARD.csv")

counts = []
for row in wards:
    try:
        counts.append(int(row.get("Govt Schools #", "").strip()))
    except (ValueError, AttributeError):
        pass

print("Ward records:", len(wards))
print("Valid school-count values:", len(counts))
print("Total recorded government schools across listed wards:", sum(counts))
print("Minimum count in a ward:", min(counts) if counts else "N/A")
print("Maximum count in a ward:", max(counts) if counts else "N/A")

print("\nINSPECTION COMPLETE!")
