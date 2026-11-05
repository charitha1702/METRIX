
from pathlib import Path
import geopandas as gpd

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "datasets" / "raw"

DATASETS = {
    "State": RAW_DIR / "State" / "State.shp",
    "District": RAW_DIR / "District" / "District.shp",
    "Taluk": RAW_DIR / "Taluk" / "Taluk.shp",
}


def inspect_dataset(name, file_path):
    print("\n" + "=" * 60)
    print(f"INSPECTING: {name.upper()}")
    print("=" * 60)

    if not file_path.exists():
        print(f"ERROR: File not found: {file_path}")
        return

    try:
        gdf = gpd.read_file(file_path)

        print("Total features:", len(gdf))
        print("Columns:", list(gdf.columns))
        print("CRS:", gdf.crs)
        print("Geometry types:", gdf.geom_type.value_counts().to_dict())
        print("Empty geometries:", gdf.geometry.is_empty.sum())
        print("Invalid geometries:", (~gdf.geometry.is_valid).sum())
        print("Missing values:")
        print(gdf.drop(columns="geometry").isna().sum())

        print("\nFirst 5 records (without geometry):")
        print(gdf.drop(columns="geometry").head().to_string(index=False))

        print("\nGeographic bounds:")
        print(gdf.total_bounds)

    except Exception as error:
        print(f"ERROR: {error}")


def main():
    print("METRIX - KARNATAKA GIS DATA INSPECTION")

    for name, file_path in DATASETS.items():
        inspect_dataset(name, file_path)

    print("\nINSPECTION COMPLETED")


if __name__ == "__main__":
    main()
