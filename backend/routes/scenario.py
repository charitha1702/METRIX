
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.claude_service import generate_planning_insights

router = APIRouter()


class ScenarioRequest(BaseModel):
    study_area: str = Field(min_length=1, max_length=100)
    growth_rate: float = Field(ge=0, le=100)
    facility_type: str = Field(min_length=1, max_length=100)
    facility_count: int = Field(ge=1, le=100)


@router.post("/calculate")
def calculate_scenario(data: ScenarioRequest):
    growth_multiplier = 1 + (data.growth_rate / 100)

    return {
        "status": "success",
        "study_area": data.study_area,
        "scenario": {
            "growth_rate": data.growth_rate,
            "growth_multiplier": round(growth_multiplier, 3),
            "facility_type": data.facility_type,
            "facility_count": data.facility_count
        },
        "interpretation": {
            "population": (
                f"The scenario assumes a "
                f"{data.growth_rate}% population increase."
            ),
            "infrastructure": (
                f"The proposed scenario includes "
                f"{data.facility_count} additional "
                f"{data.facility_type} facilities."
            )
        },
        "data_status": {
            "population_baseline": "Not provided",
            "infrastructure_baseline": "Not provided",
            "results_type": "Hypothetical scenario",
            "warning": (
                "Actual population projections and infrastructure "
                "demand cannot be calculated without verified "
                "baseline datasets."
            )
        }
    }


@router.post("/insights")
def get_scenario_insights(data: ScenarioRequest):

    # Calculate scenario results using Python first.
    scenario_result = calculate_scenario(data)

    # Send calculated results to Claude for interpretation.
    try:
        insights = generate_planning_insights(scenario_result)

        return {
            "status": "success",
            "study_area": data.study_area,
            "scenario": scenario_result,
            "insights": insights
        }

    except Exception as e:
        print("\n--- CLAUDE API ERROR ---")
        print(type(e).__name__)
        print(str(e))
        print("-----------------------\n")

        raise HTTPException(
            status_code=502,
            detail="Claude AI request failed. Check backend terminal for the actual error."
        )
