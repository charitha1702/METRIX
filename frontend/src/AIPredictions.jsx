
import { useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";

import {
  BrainCircuit,
  TrendingUp,
  Users,
  CalendarDays,
  Lightbulb,
  Building2,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";

// Illustrative historical data.
// Replace with verified population data during backend integration.

const historicalData = [
  { year: "2019", population: 1.2 },
  { year: "2020", population: 1.3 },
  { year: "2021", population: 1.45 },
  { year: "2022", population: 1.58 },
  { year: "2023", population: 1.76 },
  { year: "2024", population: 1.95 },
  { year: "2025", population: 2.18 },
];

const scenarios = {
  Low: {
    rate: 2,
    description: "Slower urban growth",
    color: "#0D9488",
  },
  Moderate: {
    rate: 4,
    description: "Steady urban growth",
    color: "#3B82F6",
  },
  High: {
    rate: 6,
    description: "Faster urban growth",
    color: "#8B5CF6",
  },
};

function AIPredictions({ studyArea }) {
  const [scenario, setScenario] = useState("Moderate");
  const [horizon, setHorizon] = useState(5);

  const basePopulation = historicalData[historicalData.length - 1].population;
  const growthRate = scenarios[scenario].rate;

  // Illustrative compound-growth scenario calculation.
  // This is not a trained machine learning prediction.

  const forecastData = [
    ...historicalData.map((item) => ({
      year: item.year,
      actual: item.population,
      projected: item.year === "2025" ? basePopulation : null,
    })),

    ...Array.from({ length: horizon }, (_, index) => {
      const year = 2026 + index;
      const yearsAhead = index + 1;

      const population =
        basePopulation * Math.pow(1 + growthRate / 100, yearsAhead);

      return {
        year: String(year),
        actual: null,
        projected: Number(population.toFixed(2)),
      };
    }),
  ];

  const projectedPopulation =
    basePopulation * Math.pow(1 + growthRate / 100, horizon);

  const populationIncrease = projectedPopulation - basePopulation;

  const increasePercentage =
    (populationIncrease / basePopulation) * 100;

  const demandIndex = (projectedPopulation / basePopulation) * 100;

  const comparison = Object.entries(scenarios).map(([name, item]) => {
    const population =
      basePopulation * Math.pow(1 + item.rate / 100, horizon);

    return {
      name,
      rate: item.rate,
      population: population.toFixed(2),
      increase: (((population - basePopulation) / basePopulation) * 100).toFixed(1),
      color: item.color,
    };
  });

  return (
    <div className="space-y-7">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            AI Predictions
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Explore possible future growth through interactive scenarios.
          </p>

          <p className="text-xs text-blue-600 font-medium mt-2">
            Study Area: {studyArea}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl">
          <BrainCircuit size={19} />
          <span className="text-sm font-medium">
            Scenario Explorer
          </span>
        </div>
      </div>

      {/* SCENARIO CONTROLS */}

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <SlidersHorizontal size={20} className="text-blue-600" />

          <h3 className="font-semibold text-slate-900">
            Configure Your Scenario
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">
              Select Growth Scenario
            </p>

            <div className="grid grid-cols-3 gap-3">
              {Object.entries(scenarios).map(([name, item]) => (
                <button
                  key={name}
                  onClick={() => setScenario(name)}
                  className={`p-3 rounded-xl border text-left transition ${
                    scenario === name
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full mb-3"
                    style={{ backgroundColor: item.color }}
                  />

                  <p className="text-sm font-semibold text-slate-800">
                    {name}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {item.rate}% / year
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-3 block">
              Prediction Period
            </label>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <CalendarDays size={19} className="text-blue-600" />

              <select
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                className="bg-transparent outline-none text-sm text-slate-700 w-full"
              >
                <option value={3}>Next 3 Years</option>
                <option value={5}>Next 5 Years</option>
                <option value={10}>Next 10 Years</option>
              </select>
            </div>

            <p className="text-xs text-slate-400 mt-3">
              Selected assumption: {growthRate}% annual population growth.
            </p>
          </div>

        </div>
      </div>

      {/* FORECAST INDICATORS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {[
          {
            title: "Current Population",
            value: `${basePopulation}M`,
            description: "Illustrative 2025 baseline",
            icon: Users,
            color: "blue",
          },
          {
            title: "Projected Population",
            value: `${projectedPopulation.toFixed(2)}M`,
            description: `After ${horizon} years`,
            icon: TrendingUp,
            color: "purple",
          },
          {
            title: "Population Increase",
            value: `+${populationIncrease.toFixed(2)}M`,
            description: `${increasePercentage.toFixed(1)}% increase`,
            icon: ArrowUpRight,
            color: "green",
          },
          {
            title: "Relative Demand Index",
            value: `${demandIndex.toFixed(0)}`,
            description: "Baseline = 100",
            icon: Building2,
            color: "orange",
          },
        ].map((item) => {
          const Icon = item.icon;

          const colors = {
            blue: "bg-blue-50 text-blue-600",
            purple: "bg-purple-50 text-purple-600",
            green: "bg-green-50 text-green-600",
            orange: "bg-orange-50 text-orange-600",
          };

          return (
            <div
              key={item.title}
              className="bg-white border border-slate-200 rounded-2xl p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-500">{item.title}</p>

                  <h2 className="text-2xl font-bold text-slate-900 mt-3">
                    {item.value}
                  </h2>
                </div>

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[item.color]}`}>
                  <Icon size={21} />
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4">
                {item.description}
              </p>
            </div>
          );
        })}

      </div>

      {/* POPULATION FORECAST */}

      <div className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-semibold text-slate-900">
              Population Forecast
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Historical trend and selected future scenario
            </p>
          </div>

          <span className="text-xs font-medium bg-orange-50 text-orange-600 px-3 py-2 rounded-lg">
            Illustrative Simulation
          </span>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />

              <XAxis dataKey="year" axisLine={false} tickLine={false} />

              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}M`}
              />

              <Tooltip
                formatter={(value) =>
                  value === null ? ["-", ""] : [`${value}M`, "Population"]
                }
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="actual"
                name="Historical Population"
                stroke="#64748B"
                strokeWidth={3}
                dot={{ r: 4 }}
                connectNulls
              />

              <Line
                type="monotone"
                dataKey="projected"
                name={`${scenario} Scenario`}
                stroke={scenarios[scenario].color}
                strokeWidth={3}
                strokeDasharray="6 4"
                dot={{ r: 4 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SCENARIO COMPARISON */}

      <div className="bg-white border border-slate-200 rounded-2xl p-6">

        <h3 className="font-semibold text-slate-900">
          Compare Growth Scenarios
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          Projected population after {horizon} years under different assumptions
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

          {comparison.map((item) => (
            <button
              key={item.name}
              onClick={() => setScenario(item.name)}
              className={`text-left p-5 rounded-xl border transition ${
                scenario === item.name
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  {item.name}
                </span>

                {scenario === item.name && (
                  <span className="text-xs text-blue-600 font-medium">
                    Selected
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mt-4">
                {item.population}M
              </h3>

              <p className="text-xs text-slate-500 mt-2">
                Annual growth: {item.rate}%
              </p>

              <p className="text-xs text-green-600 font-semibold mt-3">
                +{item.increase}% from baseline
              </p>
            </button>
          ))}

        </div>
      </div>

      {/* PLANNING INSIGHT */}

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={21} className="text-blue-600" />

          <h3 className="font-semibold text-blue-900">
            Planning Insight
          </h3>
        </div>

        <div className="space-y-3 text-sm text-blue-900">
          <p>
            Under the selected <strong>{scenario.toLowerCase()}</strong> growth
            scenario, the illustrative population could reach{" "}
            <strong>{projectedPopulation.toFixed(2)} million</strong> by{" "}
            <strong>{2025 + horizon}</strong>.
          </p>

          <p>
            This represents an increase of{" "}
            <strong>{increasePercentage.toFixed(1)}%</strong> over the baseline.
          </p>

          <p>
            Planners can use this scenario to explore whether future healthcare,
            education, water and transport capacity may need to be reviewed.
          </p>
        </div>

      </div>

      {/* DISCLAIMER */}

      <p className="text-xs text-slate-400 text-center">
        Demonstration only: projections use an assumed constant annual growth
        rate and illustrative baseline data. The relative demand index is a
        population-based indicator, not a measured infrastructure demand forecast.
        No trained AI model is used on this page yet.
      </p>

    </div>
  );
}

export default AIPredictions;
