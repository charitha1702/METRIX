
import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import {
  Users,
  TrendingUp,
  Building2,
  Activity,
  ArrowUpRight,
  CalendarDays,
  Lightbulb,
} from "lucide-react";

// Illustrative demo data.
// Replace with verified datasets during backend integration.

const growthData = [
  { year: "2019", population: 1.2, builtUp: 42 },
  { year: "2020", population: 1.3, builtUp: 45 },
  { year: "2021", population: 1.45, builtUp: 49 },
  { year: "2022", population: 1.58, builtUp: 54 },
  { year: "2023", population: 1.76, builtUp: 59 },
  { year: "2024", population: 1.95, builtUp: 65 },
  { year: "2025", population: 2.18, builtUp: 72 },
];

const periodOptions = {
  "2019-2025": "2019–2025",
  "2021-2025": "2021–2025",
  "2023-2025": "2023–2025",
};

function GrowthAnalysis({ studyArea }) {
  const [period, setPeriod] = useState("2019-2025");

  const [startYear, endYear] = period.split("-");
  const filteredData = growthData.filter(
    (item) => item.year >= startYear && item.year <= endYear
  );

  const first = filteredData[0];
  const last = filteredData[filteredData.length - 1];

  const populationGrowth = (
    ((last.population - first.population) / first.population) * 100
  ).toFixed(1);

  const builtUpGrowth = (
    ((last.builtUp - first.builtUp) / first.builtUp) * 100
  ).toFixed(1);

  const averageGrowth = (
    Number(populationGrowth) /
    (filteredData.length - 1)
  ).toFixed(1);

  const indicators = [
    {
      title: "Population Growth",
      value: `${populationGrowth}%`,
      description: `Change during ${periodOptions[period]}`,
      icon: Users,
      color: "blue",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Urban Expansion",
      value: `${builtUpGrowth}%`,
      description: "Built-up area change",
      icon: Building2,
      color: "purple",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      title: "Average Annual Growth",
      value: `${averageGrowth}%`,
      description: "Average population growth per year",
      icon: TrendingUp,
      color: "green",
      bg: "bg-green-50",
      text: "text-green-600",
    },
  ];

  return (
    <div className="space-y-7">

      {/* PAGE HEADING */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Growth Analysis
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Understand population trends and urban expansion patterns.
          </p>
          <p className="text-xs text-blue-600 mt-2 font-medium">
            Study Area: {studyArea}
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-2">
            Select Time Period
          </label>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3">
            <CalendarDays size={17} className="text-blue-600" />

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-sm text-slate-700 outline-none bg-transparent"
            >
              {Object.entries(periodOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* INDICATOR CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {indicators.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <h2 className="text-3xl font-bold text-slate-900 mt-3">
                    {item.value}
                  </h2>
                </div>

                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.bg} ${item.text}`}>
                  <Icon size={22} />
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* POPULATION TREND */}

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-semibold text-slate-900">
              Population Growth Trend
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Estimated population over time
            </p>
          </div>

          <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-2 rounded-lg">
            Demo Data
          </span>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="populationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

              <XAxis dataKey="year" axisLine={false} tickLine={false} />

              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}M`}
              />

              <Tooltip formatter={(value) => [`${value}M`, "Population"]} />

              <Area
                type="monotone"
                dataKey="population"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#populationGradient)"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* URBAN EXPANSION CHART */}

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900">
            Urban Expansion Trend
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Illustrative built-up area index over time
          </p>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

              <XAxis dataKey="year" axisLine={false} tickLine={false} />

              <YAxis axisLine={false} tickLine={false} />

              <Tooltip formatter={(value) => [value, "Built-up area index"]} />

              <Bar
                dataKey="builtUp"
                name="Built-up area index"
                fill="#8B5CF6"
                radius={[6, 6, 0, 0]}
                barSize={38}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* COMPARISON CHART */}

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900">
            Population vs Urban Expansion
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Compare the direction of both growth indicators
          </p>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

              <XAxis dataKey="year" axisLine={false} tickLine={false} />

              <YAxis axisLine={false} tickLine={false} />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="population"
                name="Population (millions)"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />

              <Line
                type="monotone"
                dataKey="builtUp"
                name="Built-up area index"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GROWTH INSIGHTS */}

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={21} className="text-blue-600" />
          <h3 className="font-semibold text-blue-900">
            Growth Insights
          </h3>
        </div>

        <div className="space-y-3 text-sm text-blue-900">
          <p>
            <span className="font-semibold">Population:</span> The illustrative
            population trend shows an overall increase during the selected period.
          </p>

          <p>
            <span className="font-semibold">Urban expansion:</span> The built-up
            area index also increases, indicating a growing urban footprint in
            this demo dataset.
          </p>

          <p>
            <span className="font-semibold">Planning consideration:</span> Compare
            these trends with verified infrastructure and service data to assess
            whether facilities are keeping pace with growth.
          </p>
        </div>
      </div>

      {/* DISCLAIMER */}

      <p className="text-xs text-slate-400 text-center">
        All figures and insights on this page use illustrative demo data.
        They are not verified measurements or AI-generated predictions.
      </p>

    </div>
  );
}

export default GrowthAnalysis;
