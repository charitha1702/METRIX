
import csv
from pathlib import Path

DATA_DIR = Path(__file__).parent / "backend" / "datasets" / "raw"

files = list(DATA_DIR.glob("*.csv"))

print(f"\nFound {len(files)} project datasets\n")

for file in files:
    print("\n" + "=" * 65)
    print("DATASET:", file.name)
    print("=" * 65)

    try:
        with open(file, "r", encoding="utf-8-sig", newline="") as f:
            sample = f.read(8192)
            f.seek(0)

            try:
                dialect = csv.Sniffer().sniff(sample)
            except csv.Error:
                dialect = csv.excel

            reader = csv.DictReader(f, dialect=dialect)
            columns = reader.fieldnames or []
            rows = list(reader)

        print("Rows:", len(rows))
        print("Columns:", len(columns))

        print("\nCOLUMN NAMES:")
        for col in columns:
            print("-", col)

        print("\nFIRST 5 RECORDS:")
        for row in rows[:5]:
            print(row)

        print("\nMISSING VALUES:")
        for col in columns:
            missing = sum(
                1 for row in rows
                if not row.get(col) or not row[col].strip()
            )
            if missing:
                print(f"{col}: {missing}")

        duplicates = len(rows) - len({
            tuple(row.get(col, "") for col in columns)
            for row in rows
        })
        print("\nExact duplicate rows:", duplicates)

    except Exception as e:
        print("ERROR:", e)

print("\nINSPECTION COMPLETED!")
