
import csv
from pathlib import Path

DATA = Path(__file__).parent / "backend" / "datasets" / "raw"


def load(filename, encoding="utf-8-sig"):
    with open(DATA / filename, encoding=encoding, newline="") as f:
        return list(csv.DictReader(f))


# Ward dataset
wards = load("NUMBER OF SCHOOLS BY WARD.csv")

print("\n===== TOP 10 WARDS BY SCHOOL COUNT =====")

valid_wards = []
for row in wards:
    try:
        count = int(row["Govt Schools #"].strip())
        valid_wards.append((count, row["Ward_No"], row["Ward Name"]))
    except (ValueError, AttributeError, KeyError):
        pass

for count, number, name in sorted(
    valid_wards, reverse=True
)[:10]:
    print(number, "|", name, "|", count)


# Hospital dataset
hospitals = load(
    "District Wise Private Hospitals in Karnataka.csv",
    encoding="cp1252"
)

print("\n===== HOSPITAL MISSING RECORDS =====")

for row in hospitals:
    if any(
        not str(value or "").strip()
        for value in row.values()
    ):
        print(row)


# Hospital district distribution
print("\n===== HOSPITALS BY DISTRICT =====")

district_counts = {}

for row in hospitals:
    district = (row.get("DISTRICT") or "").strip().upper()
    hospital = (row.get("HOSPITAL") or "").strip()

    if district and hospital:
        district_counts[district] = (
            district_counts.get(district, 0) + 1
        )

for district, count in sorted(
    district_counts.items(),
    key=lambda x: x[1],
    reverse=True
):
    print(district, ":", count)

print("\nCHECK COMPLETE!")
