
import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

def get_claude_client():
    base_url = os.getenv("ANTHROPIC_BASE_URL")
    auth_token = os.getenv("ANTHROPIC_AUTH_TOKEN")

    if not base_url or not auth_token:
        raise ValueError("Claude API configuration is missing.")

    return Anthropic(
        base_url=base_url,
        auth_token=auth_token
    )


def generate_planning_insights(scenario_data: dict):
    client = get_claude_client()

    model = os.getenv(
        "ANTHROPIC_MODEL",
        "kr/claude-sonnet-4.5"
    )

    prompt = f"""
You are METRIX, an AI-assisted urban planning decision-support system.

Analyze the following hypothetical scenario:

{scenario_data}

Provide:
1. Scenario overview.
2. Potential infrastructure planning implications.
3. Important trade-offs and risks.
4. Practical planning recommendations.
5. Additional real-world data needed for validation.

IMPORTANT:
- Do not invent population figures or infrastructure statistics.
- Distinguish hypothetical assumptions from verified facts.
- The available geographic boundaries do not provide population
  or infrastructure baselines.
- Do not claim that proposed facilities are sufficient.
- Explain limitations clearly.

Use clear headings and concise language.
"""

    response = client.messages.create(
        model=model,
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.content[0].text
