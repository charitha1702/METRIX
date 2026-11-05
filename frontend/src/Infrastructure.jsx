
import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  Hospital,
  School,
  MapPin,
  Building2,
  AlertTriangle,
  Filter,
  RefreshCw,
} from "lucide-react";

const API_URL =
  "http://127.0.0.1:8002/api/infrastructure/overview";

const CHART_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#06B6D4",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#6366F1",
  "#EC4899",
];

function Infrastructure({ studyArea }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchInfrastructureData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `API request failed with status ${response.status}`
        );
      }

      const result = await response.json();

      setData(result);
    } catch (err) {
      console.error("Infrastructure API error:", err);
      setError(
        "Unable to load infrastructure data. Please check whether the backend is running on port 8002."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfrastructureData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <RefreshCw className="animate-spin text-blue-600" size={30} />
        <p className="text-slate-500 text-sm">
          Loading infrastructure datasets...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">
        <AlertTriangle className="mx-auto text-red-500 mb-3" size={32} />

        <h2 className="text-lg font-semibold text-slate-800">
          Infrastructure Data Unavailable
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          {error}
        </p>

        <button
          onClick={fetchInfrastructureData}
          className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const summary = data.summary;

  const schoolCategories = data.schools.by_category;
  const schoolBlocks = data.schools.by_block;

  const hospitalDistricts = data.hospitals.by_district;
  const wardCounts = data.ward_school_counts;

  const filteredSchoolCategories =
    selectedCategory === "All" ||
    selectedCategory === "Education"
      ? schoolCategories
      : [];

  const filteredHospitalDistricts =
    selectedCategory === "All" ||
    selectedCategory === "Healthcare"
      ? hospitalDistricts
      : [];

  const indicators = [
    {
      title: "School Records",
      value: summary.school_records.toLocaleString("en-IN"),
      description: "Available BBMP school inventory",
      icon: School,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Private Hospital Records",
      value: summary.private_hospital_records.toLocaleString("en-IN"),
      description: "Records in supplied hospital dataset",
      icon: Hospital,
      bg: "bg-red-50",
      color: "text-red-600",
    },
    {
      title: "Schools With Coordinates",
      value: summary.schools_with_coordinates.toLocaleString("en-IN"),
      description: `${summary.schools_without_coordinates} without coordinates`,
      icon: MapPin,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      title: "Government Schools",
      value: summary.government_schools_in_ward_dataset.toLocaleString("en-IN"),
      description: `Across ${summary.ward_records} ward records`,
      icon: Building2,
      bg: "bg-teal-50",
      color: "text-teal-600",
    },
  ];

  return (
    <div className="space-y-7">

      {/* PAGE HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Infrastructure Analysis
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Explore available school and hospital inventory across the study datasets.
          </p>

          <p className="text-xs text-blue-600 mt-2 font-medium">
            Study Area: {studyArea || "Available Dataset Coverage"}
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3">
            <Filter size={17} className="text-blue-600" />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm text-slate-700 outline-none bg-transparent"
            >
              <option value="All">All Categories</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>

          <button
            onClick={fetchInfrastructureData}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
            title="Refresh data"
          >
            <RefreshCw size={18} className="text-blue-600" />
          </button>

        </div>
      </div>

      {/* DATA STATUS */}

      <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
        <span className="w-2 h-2 rounded-full bg-green-500" />

        Infrastructure datasets successfully connected to METRIX API.
      </div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {indicators.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">

                <div>
                  <p className="text-sm text-slate-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold text-slate-900 mt-3">
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}
                >
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

      {/* SCHOOL CATEGORY DISTRIBUTION */}

      {(selectedCategory === "All" ||
        selectedCategory === "Education") && (

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">

            <h3 className="font-semibold text-slate-900">
              School Category Distribution
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Number of school records by category
            </p>

            <div className="w-full h-80 mt-5">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart
                  data={filteredSchoolCategories}
                  layout="vertical"
                  margin={{ left: 15, right: 25 }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#E2E8F0"
                  />

                  <XAxis type="number" axisLine={false} tickLine={false} />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={115}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    name="School records"
                    fill="#3B82F6"
                    radius={[0, 6, 6, 0]}
                    barSize={32}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>
          </div>

          {/* SCHOOL CATEGORY PIE CHART */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <h3 className="font-semibold text-slate-900">
              School Category Breakdown
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Share of available school records
            </p>

            <div className="h-64 mt-4">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={filteredSchoolCategories}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >

                    {filteredSchoolCategories.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}

                  </Pie>

                  <Tooltip />
                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>
      )}

      {/* SCHOOL DISTRIBUTION BY BLOCK */}

      {(selectedCategory === "All" ||
        selectedCategory === "Education") && (

        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <h3 className="font-semibold text-slate-900">
            School Distribution by Block
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            School records grouped by administrative block
          </p>

          <div className="w-full h-96 mt-5">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={schoolBlocks}
                margin={{ top: 10, right: 20, left: 5, bottom: 50 }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={80}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  name="School records"
                  fill="#6366F1"
                  radius={[6, 6, 0, 0]}
                  barSize={35}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>
      )}

      {/* HOSPITAL DISTRIBUTION */}

      {(selectedCategory === "All" ||
        selectedCategory === "Healthcare") && (

        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <h3 className="font-semibold text-slate-900">
            Private Hospital Records by District
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Distribution of records in the supplied hospital dataset
          </p>

          <div className="w-full h-[420px] mt-5">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={hospitalDistricts}
                layout="vertical"
                margin={{ left: 25, right: 30 }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#E2E8F0"
                />

                <XAxis type="number" axisLine={false} tickLine={false} />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={135}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  name="Hospital records"
                  fill="#EF4444"
                  radius={[0, 6, 6, 0]}
                  barSize={20}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>
      )}

      {/* WARD-WISE GOVERNMENT SCHOOL COUNTS */}

      {(selectedCategory === "All" ||
        selectedCategory === "Education") && (

        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <h3 className="font-semibold text-slate-900">
            Ward-wise Government School Counts
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Government school counts from the available ward dataset
          </p>

          <div className="overflow-x-auto mt-5">

            <table className="w-full text-sm text-left">

              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Ward No.</th>
                  <th className="px-4 py-3 font-medium">Ward Name</th>
                  <th className="px-4 py-3 font-medium text-right">
                    Government Schools
                  </th>
                </tr>
              </thead>

              <tbody>

                {wardCounts.map((ward) => (

                  <tr
                    key={ward.ward_no}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >

                    <td className="px-4 py-3 text-slate-500">
                      {ward.ward_no}
                    </td>

                    <td className="px-4 py-3 font-medium text-slate-800">
                      {ward.ward_name}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold text-slate-700">
                      {Number(ward.government_schools).toLocaleString("en-IN")}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* DATA LIMITATIONS */}

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">

        <div className="flex items-center gap-2">

          <AlertTriangle size={19} className="text-amber-600" />

          <h3 className="font-semibold text-slate-800">
            Data Transparency & Limitations
          </h3>

        </div>

        <ul className="list-disc pl-5 space-y-2 mt-4 text-xs text-slate-600">

          {data.data_limitations.map((limitation, index) => (
            <li key={index}>{limitation}</li>
          ))}

        </ul>

      </div>

      <p className="text-xs text-slate-400 text-center">
        METRIX presents available inventory records. Facility counts alone
        do not establish population-adjusted demand, accessibility or
        verified infrastructure gaps.
      </p>

    </div>
  );
}

export default Infrastructure;
