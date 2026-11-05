# METRIX
### Intelligent, Data-Driven City Planning

**Plan Ahead. Build Smarter. Grow Better.**

An AI-assisted urban and regional planning platform that connects geospatial data, population and infrastructure analysis, and interactive scenario planning to support informed development decisions.

---

## 1. Overview

Urban and semi-urban regions are expanding continuously. New residential areas emerge, populations increase, and communities evolve. However, essential infrastructure such as healthcare facilities, educational institutions, roads and water services may not develop at the same pace.

This creates a growing challenge for urban and regional planners: understanding where infrastructure is available, identifying potential service gaps and evaluating what developing regions may require in the future.

**METRIX** addresses this challenge through an integrated, data-driven planning platform.

It brings together geographic exploration, structured infrastructure datasets, regional analysis and AI-assisted scenario planning to help users understand existing development patterns and explore potential future infrastructure requirements.

Rather than presenting information through static dashboards alone, METRIX aims to make planning more interactive, exploratory and evidence-oriented.

## 2. Problem Statement

How can geographic data, population-demand analysis and AI-assisted scenario planning help identify potential infrastructure gaps and support better planning decisions in developing regions?

### Challenges We Address

- **Unbalanced development:** Population and residential growth can outpace essential infrastructure development.
- **Fragmented information:** Geographic and infrastructure datasets are often distributed across different sources and formats.
- **Data inconsistency:** Missing values, inconsistent geographic identifiers and inaccurate coordinates make regional analysis difficult.
- **Limited planning exploration:** Static reports and dashboards offer limited opportunities to evaluate hypothetical development scenarios.
- **Reactive decision-making:** Identifying potential infrastructure requirements before development accelerates can be challenging.

## 3. Our Solution

METRIX provides an interactive platform that connects geographic information with infrastructure analysis and AI-assisted planning.

The platform enables users to:

1. Select and explore geographic regions.
2. Visualize district and taluk boundaries.
3. Examine available population and infrastructure information.
4. Explore the distribution of mapped facilities.
5. Identify potential infrastructure service gaps using available data.
6. Experiment with hypothetical development scenarios.
7. Review AI-assisted insights to support planning decisions.

The central idea is simple:

> Most planning platforms help us understand what a region looks like today. METRIX aims to help us explore what that region might need tomorrow.

---

## 4. Core Features

### 4.1 Geographic Exploration and Mapping

Explore geographic regions through an interactive mapping interface.

- Interactive geographic visualization.
- District and taluk boundary exploration.
- Region-based selection and navigation.
- Geographic layers and infrastructure visualization.
- Spatial exploration of available regional datasets.

### 4.2 Population and Growth Analysis

Understand available population information and regional development patterns.

- Explore population-related indicators.
- Examine regional growth information.
- Support analysis of changing infrastructure demand.
- Present relevant information through visual dashboards.

### 4.3 Infrastructure Analysis

Explore the distribution of essential public infrastructure.

- School dataset exploration.
- Hospital dataset exploration.
- Facility distribution visualization.
- Region-based infrastructure analysis.
- Examination of available infrastructure information.

### 4.4 Potential Infrastructure Gap Detection

Identify regions that may require further infrastructure assessment.

- Explore mapped facility availability.
- Examine infrastructure distribution across geographic regions.
- Highlight potential service gaps.
- Support investigation of underserved areas.

Infrastructure availability is not equivalent to accessibility or service adequacy. Further validation is necessary before making real-world planning decisions.

### 4.5 AI-Assisted Planning Insights

Use AI to support the interpretation of available analytical information.

- Generate contextual planning insights.
- Interpret selected regional information.
- Provide scenario-related observations.
- Support exploration of potential infrastructure requirements.

### 4.6 What-If Scenario Planning

One of the key differentiating capabilities of METRIX is its interactive scenario-planning approach.

Users can experiment with hypothetical development conditions and explore their possible planning implications.

- Adjust hypothetical population-growth assumptions.
- Explore proposed infrastructure additions.
- Evaluate different development scenarios.
- Generate contextual AI-assisted insights.
- Understand how planning assumptions may influence potential infrastructure requirements.

Scenario outputs are exploratory and should not be interpreted as guaranteed predictions of future conditions.

### 4.7 User Authentication

- User registration and login.
- Session-based authentication.
- Supabase authentication integration.

---

## 5. How METRIX Works

The platform follows a connected workflow that transforms available datasets into planning-oriented insights.

```text
       GEOGRAPHIC REGION SELECTION
                   |
                   v
        GEOGRAPHIC EXPLORATION
                   |
                   v
        DATA PREPARATION & VALIDATION
                   |
                   v
       POPULATION & INFRASTRUCTURE
                ANALYSIS
                   |
                   v
       POTENTIAL GAP EXPLORATION
                   |
                   v
         WHAT-IF SCENARIO PLANNING
                   |
                   v
          AI-ASSISTED INSIGHTS
                   |
                   v
        INFORMED PLANNING SUPPORT
```

The objective is to connect geographic understanding, available data and scenario-based exploration within a single platform.

---

## 6. Data Collection and Preparation

Reliable analysis begins with structured and validated data.

METRIX uses geographic boundary datasets and available public infrastructure datasets for its analysis.

### Data Categories

| Data Category | Purpose |
|---|---|
| Geographic boundaries | Represent state, district and taluk boundaries |
| School information | Explore educational infrastructure distribution |
| Hospital information | Examine healthcare facility distribution |
| Ward-level school counts | Understand available government school counts across wards |
| Population-related information | Support regional growth and demand analysis where data is available |

### Data Preparation Approach

The data preparation process focuses on improving consistency and usability.

Key considerations include:

- Inspecting source files and their structures.
- Identifying missing and inconsistent values.
- Checking geographic identifiers and administrative labels.
- Validating latitude and longitude information.
- Identifying malformed records and duplicate entries.
- Standardizing datasets for downstream analysis.
- Separating raw source data from processed datasets.

### Geographic Data Processing

METRIX uses geospatial processing libraries to work with geographic boundary information.

- Shapefiles are used as geographic source data.
- GeoPandas supports geospatial data processing.
- Shapely supports geometric operations.
- PyProj supports coordinate reference system transformations.
- GeoJSON is used for geographic data exchange and visualization.

### Data Coverage and Quality

Data availability varies across geographic regions and infrastructure categories.

METRIX distinguishes between unavailable information and confirmed absence of infrastructure. Missing records are not automatically treated as zero.

The quality and coverage of the underlying datasets determine the reliability of the resulting analysis.

---

## 7. Technology Stack

METRIX combines modern frontend technologies, Python-based backend services and geospatial processing tools.

| Layer | Technologies | Purpose |
|---|---|---|
| Frontend | React, Vite | Interactive user interface |
| Styling | CSS | Application styling and layouts |
| Backend | Python, FastAPI | API development and backend services |
| Data Processing | Pandas | Structured dataset processing |
| Geospatial Processing | GeoPandas, Shapely, PyProj | Geographic data preparation and spatial operations |
| Mapping | Leaflet, React Leaflet | Interactive geographic visualization |
| Charts | Recharts | Analytical data visualization |
| Authentication | Supabase | User authentication |
| AI Integration | Claude API integration | AI-assisted planning insights |
| Data Formats | CSV, GeoJSON, Shapefile | Structured and geographic data management |

---

## 8. System Architecture

METRIX follows a frontend-backend architecture.

```text
              USER
               |
               v
       REACT FRONTEND
               |
               v
         FASTAPI BACKEND
               |
       +-------+--------+
       |       |        |
       v       v        v
   GEOSPATIAL DATA   DATA ANALYSIS
   PROCESSING       & VALIDATION
       |       |        |
       +-------+--------+
               |
               v
       SCENARIO ANALYSIS
               |
               v
        AI INTEGRATION
               |
               v
       PLANNING INSIGHTS
               |
               v
        FRONTEND DISPLAY
```

### Architectural Components

**Frontend:** Provides the user interface for geographic exploration, analytical dashboards and scenario planning.

**Backend:** Handles API requests, data processing and application logic through FastAPI.

**Geospatial Processing:** Processes geographic boundaries and supports spatial data operations.

**Data Analysis:** Works with available infrastructure and regional datasets.

**AI Integration:** Uses contextual information to generate AI-assisted planning insights.

---

## 9. Responsible AI

Infrastructure planning can influence communities, public services and long-term development decisions. Therefore, responsible AI is an important consideration in METRIX.

Our approach is guided by the following principles:

| Principle | Our Approach |
|---|---|
| Data Quality | Validate datasets and identify incomplete or inconsistent information. |
| Fairness | Avoid treating regions with limited data as regions with limited infrastructure. |
| Explainability | Connect AI-generated insights to available information and scenario assumptions. |
| Human Oversight | Keep planning decisions under the control of qualified human authorities. |
| Privacy | Protect user credentials and avoid unnecessary exposure of personal information. |
| Transparency | Clearly distinguish hypothetical scenarios from verified facts and forecasts. |

### Human-Centered Planning

METRIX is intended to support planners, not replace them.

AI-generated insights are decision-support outputs. They require verification against reliable datasets, ground-level conditions and professional planning expertise before implementation.

**Our principle: Trustworthy data before automated decisions.**

---

## 10. Scalability

METRIX is designed with the potential to expand beyond its initial geographic coverage.

Future scalability can be achieved through the following improvements:

### Geographic Scalability
- Extend geographic coverage to additional districts, states and regions.
- Integrate verified geographic boundary datasets.
- Support reusable region-selection and analysis workflows.

### Data Scalability
- Develop automated data ingestion pipelines.
- Introduce systematic validation and quality checks.
- Maintain dataset source information and update history.
- Integrate additional government and public datasets.

### Infrastructure Scalability
- Introduce PostgreSQL and PostGIS for large-scale geospatial data management.
- Optimize spatial queries and geographic operations.
- Modularize backend services for independent scaling.

### AI Scalability
- Integrate advanced predictive models as reliable historical data becomes available.
- Ground AI-generated insights in validated analytical results.
- Support contextual planning queries and scenario comparisons.

These improvements provide a potential pathway toward broader regional and national-scale applications. Nationwide deployment is not claimed by the current prototype.

---

## 11. Future Scope

METRIX can be extended with additional capabilities to improve the depth and reach of data-driven planning.
- **Advanced Predictive Models:** Introduce machine-learning models for more detailed population-demand and infrastructure forecasting.
- **AI Planning Chatbot:** Enable interactive questions about selected regions, scenarios and generated insights.
- **Expanded Geographic Coverage:** Integrate verified datasets across more districts and states.
- **Automated Data Pipelines:** Support regular data updates and validation.
- **Advanced Accessibility Analysis:** Examine facility accessibility using distance, travel time and population distribution.
- **Multi-Scenario Comparison:** Compare alternative development strategies.
- **Decision Support Reports:** Generate structured planning summaries and reports.
- **Large-Scale Geospatial Database:** Adopt PostGIS for efficient spatial data storage and querying.

---

## 12. Data Limitations and Transparency

METRIX is a prototype built using available geographic and infrastructure datasets.
Some important limitations must be considered:
- Geographic and infrastructure data coverage varies by region.
- Some datasets may contain missing, outdated or inconsistent records.
- Facility counts alone cannot establish accessibility, capacity or service adequacy.
- Incomplete datasets can affect regional comparisons.
- Hypothetical scenarios do not guarantee actual future outcomes.
- AI-generated insights depend on the quality and context of the information provided.

METRIX should therefore be considered a planning-support platform rather than a replacement for verified government data, professional planning assessments or official decision-making.

---

## 13. Getting Started
Follow these instructions to set up METRIX locally.

### Prerequisites

Ensure that the following are installed:
- Python
- Node.js
- npm
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/charitha1702/METRIX.git
cd METRIX
```

### Step 2: Set Up the Backend

Create a Python virtual environment from the project root:
```bash
python -m venv .venv
```

Activate the environment on Windows PowerShell:
```powershell
.\.venv\Scripts\Activate.ps1
```

Install backend dependencies:
```bash
pip install -r backend/requirements.txt
```

Navigate to the backend directory:

```bash
cd backend
```

Start the FastAPI development server:
```bash
python -m uvicorn main:app --reload --port 8002
```
Backend URL:
`http://127.0.0.1:8002`

Interactive API documentation:
`http://127.0.0.1:8002/docs`

### Step 3: Set Up the Frontend

Open a second terminal and navigate to the frontend directory:
```bash
cd METRIX/frontend
```

Install dependencies:
```bash
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file inside the `frontend` directory.
Add your Supabase project configuration:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Replace the placeholders with your own project credentials.
Do not commit `.env` files, private API keys or service-role credentials to GitHub.

### Step 5: Start the Frontend
```bash
npm run dev
```

Open the application in your browser:
`http://localhost:5173`
**Note:** Run the backend and frontend in separate terminals. Additional configuration may be required depending on your local environment and external service credentials.

---

## 14. Project Structure

```text
METRIX/
│
├── backend/
│   ├── datasets/
│   │   ├── raw/
│   │   └── processed/
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── dashboard.py
│   │   ├── growth.py
│   │   ├── infrastructure.py
│   │   ├── mapping.py
│   │   ├── mapping_backup.py
│   │   ├── predictions.py
│   │   └── scenario.py
│   │
│   ├── services/
│   │   ├── claude_service.py
│   │   ├── data_pipelines.py
│   │   ├── inspect_boundaries.py
│   │   └── process_boundaries.py
│   │
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── AIPredictions.jsx
│   │   ├── App.jsx
│   │   ├── AuthPage.jsx
│   │   ├── CityIllustration.jsx
│   │   ├── CityMapping.jsx
│   │   ├── GrowthAnalysis.jsx
│   │   ├── Infrastructure.jsx
│   │   ├── LandingPage.jsx
│   │   ├── ScenarioPlanning.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── supabase.js
│   │
│   ├── package.json
│   └── vite.config.js
│
├── check_anomalies.py
├── inspect_datasets.py
├── inspect_more.py
├── .gitignore
└── README.md
```
---

## 15. Team
**METRIX Project Team**

Developed as part of the **AI for Smarter Cities** hackathon.
| Team Member | Contribution |
|---|---|
| P S Charitha | Project development |

---
## 16. Vision

Cities should not have to wait for infrastructure shortages to become visible problems.
By connecting geographic information, infrastructure analysis and AI-assisted scenario exploration, METRIX aims to encourage more informed and forward-looking planning.
> A city doesn't become unplanned overnight. It outgrows its plans.

**METRIX — Plan Ahead. Build Smarter. Grow Better.**
*Built with the vision of making urban and regional planning more data-driven, interactive and future-oriented.*
