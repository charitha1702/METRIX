
from pathlib import Path
import geopandas as gpd

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "datasets" / "raw"
OUTPUT_DIR = BASE_DIR / "datasets" / "processed"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

DATASETS = {
    "state": {
        "path": RAW_DIR / "State" / "State.shp",
        "columns": ["KGISStateI", "KGISStateC", "KGISStateN", "geometry"],
    },
    "districts": {
        "path": RAW_DIR / "District" / "District.shp",
        "columns": [
            "KGISDistri",
            "LGD_Distri",
            "KGISDist_1",
            "BhuCodeDis",
            "geometry",
        ],
    },
    "taluks": {
        "path": RAW_DIR / "Taluk" / "Taluk.shp",
        "columns": [
            "KGISTalukC",
            "LGD_TalukC",
            "KGISTalukN",
            "KGISDistri",
            "geometry",
        ],
    },
}


def process_dataset(name, config):
    print(f"\nProcessing {name}...")

    gdf = gpd.read_file(config["path"])

    # Keep only useful attributes and geometry.
    gdf = gdf[config["columns"]].copy()

    # Repair invalid geometries in the processed copy.
    invalid_before = (~gdf.geometry.is_valid).sum()

    if invalid_before > 0:
        gdf.geometry = gdf.geometry.make_valid()

    # Convert to latitude/longitude for web maps.
    gdf = gdf.to_crs(epsg=4326)

    invalid_after = (~gdf.geometry.is_valid).sum()

    output_path = OUTPUT_DIR / f"{name}.geojson"
    gdf.to_file(output_path, driver="GeoJSON")

    print("Features:", len(gdf))
    print("Invalid before repair:", invalid_before)
    print("Invalid after repair:", invalid_after)
    print("CRS:", gdf.crs)
    print("Saved:", output_path)


def main():
    for name, config in DATASETS.items():
        process_dataset(name, config)

    print("\nALL BOUNDARY DATASETS PROCESSED!")


if __name__ == "__main__":
    main()
