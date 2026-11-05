from fastapi import APIRouter

router = APIRouter()


@router.get("/summary")
def get_dashboard_summary():
    return {
        "module": "Dashboard",
        "status": "connected",
        "data_status": "awaiting_real_datasets",
        "message": "METRIX dashboard API is ready."
    }