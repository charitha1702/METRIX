import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  MapPin,
  School,
  Hospital,
  Layers,
  Search,
  ChevronDown,
  Info,
  Loader2,
  X,
  Map as MapIcon,
} from "lucide-react";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const API_BASE = "http://127.0.0.1:8002/api/mapping";
const DEFAULT_CENTER = [15.3173, 75.7139];

function MapController({ selectedFeature, boundaryType }) {
  const map = useMap();

  useEffect(() => {
    if (selectedFeature) {
      const bounds = L.geoJSON(selectedFeature).getBounds();

      if (bounds.isValid()) {
        map.flyToBounds(bounds, {
          padding: [35, 35],
          duration: 1,
          maxZoom: boundaryType === "taluks" ? 12 : 9,
        });
      }
    } else {
      map.flyTo(DEFAULT_CENTER, 7, { duration: 1 });
    }
  }, [selectedFeature, boundaryType, map]);

  return null;
}

const boundaryStyle = {
  color: "#9aa9b5",
  weight: 1,
  fillColor: "#dce5e9",
  fillOpacity: 0.12,
};

const selectedBoundaryStyle = {
  color: "#496b83",
  weight: 2.5,
  fillColor: "#a9c1ce",
  fillOpacity: 0.38,
};

const boundaryOptions = [
  { label: "State", value: "state" },
  { label: "Districts", value: "districts" },
  { label: "Taluks", value: "taluks" },
];

const boundaryTitles = {
  state: "State boundaries",
  districts: "District boundaries",
  taluks: "Taluk boundaries",
};

function Metric({ icon: Icon, label, value, note }) {
  return (
    <div className="border border-[#e8e7e1] bg-white rounded-xl p-4">
      <div className="flex items-center gap-2 text-[#82918e]">
        <Icon size={15} />
        <span className="text-xs">{label}</span>
      </div>

      <p className="text-2xl font-semibold text-[#30495d] mt-3">
        {value === null || value === undefined
          ? "—"
          : Number(value).toLocaleString("en-IN")}
      </p>

      <p className="text-[11px] text-[#929c9e] mt-1">{note}</p>
    </div>
  );
}

function CityMapping({
  studyArea = "Karnataka",
  districts = [],
  taluks = [],
  selectedDistrict = null,
  selectedDistrictCode = "",
  selectedTaluk = "",
  onDistrictChange = () => {},
  onTalukChange = () => {},
}) {
  const [boundaryType, setBoundaryType] = useState(
    selectedTaluk ? "taluks" : "districts"
  );

  const [boundaryData, setBoundaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [infrastructure, setInfrastructure] = useState(null);
  const [schoolData, setSchoolData] = useState(null);
  const [schoolLocations, setSchoolLocations] = useState([]);
  const [facilityLoading, setFacilityLoading] = useState(false);
  const [facilityError, setFacilityError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    setBoundaryType(selectedTaluk ? "taluks" : "districts");
  }, [selectedDistrictCode, selectedTaluk]);

  const filteredTaluks = taluks
    .filter(
      (taluk) =>
        String(taluk.properties?.KGISDistri) ===
        String(selectedDistrictCode)
    )
    .sort((a, b) =>
      String(a.properties?.KGISTalukN || "").localeCompare(
        String(b.properties?.KGISTalukN || "")
      )
    );

  // Load administrative boundaries.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchBoundaries() {
      setLoading(true);
      setError("");
      setBoundaryData(null);

      try {
        const params =
          boundaryType === "taluks" && selectedDistrictCode
            ? `?district_code=${encodeURIComponent(selectedDistrictCode)}`
            : "";

        const response = await fetch(
          `${API_BASE}/${boundaryType}${params}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        if (data.type !== "FeatureCollection") {
          throw new Error("Invalid geographical data.");
        }

        setBoundaryData(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Boundary loading error:", err);
          setError("Unable to load boundaries. Check the backend connection.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBoundaries();

    return () => controller.abort();
  }, [boundaryType, selectedDistrictCode]);

  // Load available infrastructure and school data.
  useEffect(() => {
    if (!selectedDistrict) {
      setInfrastructure(null);
      setSchoolData(null);
      setSchoolLocations([]);
      return;
    }

    const controller = new AbortController();

    async function fetchInfrastructureData() {
      setFacilityLoading(true);
      setFacilityError("");

      setInfrastructure(null);
      setSchoolData(null);
      setSchoolLocations([]);

      try {
        const district = encodeURIComponent(
          selectedDistrict.properties?.KGISDist_1 || ""
        );

        const taluk = encodeURIComponent(selectedTaluk || "");

        const [
          infrastructureResponse,
          schoolsResponse,
          locationsResponse,
        ] = await Promise.all([
          fetch(
            `${API_BASE}/infrastructure?district=${district}&taluk=${taluk}`,
            { signal: controller.signal }
          ),
          fetch(`${API_BASE}/schools?district=${district}`, {
            signal: controller.signal,
          }),
          fetch(`${API_BASE}/school-locations?district=${district}`, {
            signal: controller.signal,
          }),
        ]);

        if (
          !infrastructureResponse.ok ||
          !schoolsResponse.ok ||
          !locationsResponse.ok
        ) {
          throw new Error("Unable to retrieve infrastructure data.");
        }

        const [
          infrastructureResult,
          schoolsResult,
          locationsResult,
        ] = await Promise.all([
          infrastructureResponse.json(),
          schoolsResponse.json(),
          locationsResponse.json(),
        ]);

        setInfrastructure(infrastructureResult);
        setSchoolData(schoolsResult);
        setSchoolLocations(locationsResult.locations || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Infrastructure loading error:", err);
          setFacilityError("Infrastructure data could not be loaded.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setFacilityLoading(false);
        }
      }
    }

    fetchInfrastructureData();

    return () => controller.abort();
  }, [selectedDistrict, selectedTaluk]);

  // Select the feature that the map should zoom into.
  const activeFeature =
    boundaryType === "taluks" && selectedTaluk
      ? boundaryData?.features?.find(
          (feature) =>
            feature.properties?.KGISTalukN === selectedTaluk &&
            String(feature.properties?.KGISDistri) ===
              String(selectedDistrictCode)
        ) || null
      : boundaryType === "districts"
        ? selectedDistrict
        : boundaryType === "taluks"
          ? selectedDistrict
          : null;

  const getBoundaryName = (feature) => {
    const properties = feature.properties || {};

    if (boundaryType === "state") {
      return properties.KGISStateN || "Karnataka";
    }

    if (boundaryType === "districts") {
      return properties.KGISDist_1 || "District";
    }

    return properties.KGISTalukN || "Taluk";
  };

  const isSelectedBoundary = (feature) => {
    if (boundaryType === "districts" && selectedDistrict) {
      return (
        String(feature.properties?.KGISDistri) ===
        String(selectedDistrictCode)
      );
    }

    if (boundaryType === "taluks" && selectedTaluk) {
      return (
        feature.properties?.KGISTalukN === selectedTaluk &&
        String(feature.properties?.KGISDistri) ===
          String(selectedDistrictCode)
      );
    }

    return false;
  };

  const getFeatureStyle = (feature) =>
    isSelectedBoundary(feature)
      ? selectedBoundaryStyle
      : boundaryStyle;

  const onEachBoundary = (feature, layer) => {
    layer.bindTooltip(getBoundaryName(feature), {
      sticky: true,
      direction: "top",
    });

    layer.on({
      mouseover: (event) => {
        event.target.setStyle({
          weight: 2.5,
          color: "#496b83",
          fillColor: "#cbdde3",
          fillOpacity: 0.35,
        });
      },
      mouseout: (event) => {
        event.target.setStyle(getFeatureStyle(feature));
      },
    });
  };

  const filteredSchools = schoolLocations.filter((school) => {
    const name = String(school.school_name || "").toLowerCase();
    const category = String(school.category || "").toLowerCase();
    const query = search.toLowerCase().trim();

    return name.includes(query) || category.includes(query);
  });

  const areaName =
    selectedTaluk ||
    selectedDistrict?.properties?.KGISDist_1 ||
    studyArea;

  const districtHospitalCount =
    infrastructure?.hospitals?.district_count ?? null;

  const talukHospitalCount =
    infrastructure?.hospitals?.taluk_count ?? null;

  const schoolCount = schoolData?.school_count ?? null;

  const mappedSchoolCount = filteredSchools.length;

  return (
    <div className="space-y-6 text-[#34465a]">

      {/* HEADER */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#87998e] mb-2">
            <MapPin size={14} />
            Geographic intelligence
          </div>

          <h1 className="serif-heading text-3xl md:text-4xl text-[#263e52]">
            City Mapping
          </h1>

          <p className="text-sm text-[#87929a] mt-2">
            Explore administrative boundaries and available infrastructure.
          </p>
        </div>

        <div className="text-xs text-[#81918b]">
          Karnataka · 31 districts · 240 taluks
        </div>
      </section>

      {/* MAIN WORKSPACE */}
      <section className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] gap-5 items-start">

        {/* LEFT CONTROL PANEL */}
        <aside className="space-y-4">

          <div className="bg-white border border-[#e8e7e1] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={16} className="text-[#728d83]" />
              <h2 className="text-sm font-semibold text-[#344e68]">
                Study area
              </h2>
            </div>

            <label className="block text-[10px] font-semibold tracking-[0.13em] text-[#929c9e] mb-2">
              DISTRICT
            </label>

            <div className="relative mb-4">
              <select
                value={selectedDistrictCode}
                onChange={(e) => {
                  onDistrictChange(e.target.value);
                  setBoundaryType("districts");
                }}
                className="w-full appearance-none bg-[#f7f7f3] border border-[#e8e7e1] rounded-lg px-3 py-3 pr-9 text-sm text-[#344e68] outline-none focus:border-[#8ba69b]"
              >
                <option value="">Select a district</option>

                {districts.map((district) => (
                  <option
                    key={district.properties.KGISDistri}
                    value={String(district.properties.KGISDistri)}
                  >
                    {district.properties.KGISDist_1}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87929a] pointer-events-none"
              />
            </div>

            <label className="block text-[10px] font-semibold tracking-[0.13em] text-[#929c9e] mb-2">
              TALUK
            </label>

            <div className="relative">
              <select
                value={selectedTaluk}
                disabled={!selectedDistrictCode}
                onChange={(e) => {
                  onTalukChange(e.target.value);
                  setBoundaryType(e.target.value ? "taluks" : "districts");
                }}
                className="w-full appearance-none bg-[#f7f7f3] border border-[#e8e7e1] rounded-lg px-3 py-3 pr-9 text-sm text-[#344e68] outline-none focus:border-[#8ba69b] disabled:opacity-50"
              >
                <option value="">All taluks in district</option>

                {filteredTaluks.map((taluk) => (
                  <option
                    key={taluk.properties.KGISTalukC}
                    value={taluk.properties.KGISTalukN}
                  >
                    {taluk.properties.KGISTalukN}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87929a] pointer-events-none"
              />
            </div>

            <div className="border-t border-[#eeede8] mt-5 pt-4">
              <p className="text-[10px] uppercase tracking-[0.13em] text-[#9aa39f]">
                Current selection
              </p>

              <p className="text-sm font-semibold text-[#344e68] mt-1">
                {areaName}
              </p>
            </div>
          </div>

          {/* INFRASTRUCTURE SUMMARY */}
          <div className="bg-white border border-[#e8e7e1] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#344e68]">
                Infrastructure
              </h2>

              {facilityLoading && (
                <Loader2
                  size={15}
                  className="animate-spin text-[#82968a]"
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#edf1f4] flex items-center justify-center text-[#637f99]">
                    <Hospital size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#405469]">
                      Hospitals
                    </p>
                    <p className="text-[11px] text-[#9aa3a5]">
                      District records
                    </p>
                  </div>
                </div>

                <span className="text-xl font-semibold text-[#344e68]">
                  {districtHospitalCount === null
                    ? "—"
                    : districtHospitalCount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="border-t border-[#efeee9]" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#edf2ed] flex items-center justify-center text-[#6e8d79]">
                    <School size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#405469]">
                      Schools
                    </p>
                    <p className="text-[11px] text-[#9aa3a5]">
                      Available dataset
                    </p>
                  </div>
                </div>

                <span className="text-xl font-semibold text-[#344e68]">
                  {schoolCount === null
                    ? "—"
                    : schoolCount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {selectedTaluk && (
              <div className="mt-4 pt-4 border-t border-[#efeee9]">
                <p className="text-xs text-[#87939a]">
                  Hospitals in {selectedTaluk}
                </p>

                <p className="text-lg font-semibold text-[#344e68] mt-1">
                  {talukHospitalCount === null
                    ? "Data unavailable"
                    : talukHospitalCount.toLocaleString("en-IN")}
                </p>
              </div>
            )}

            {schoolData && !schoolData.data_available && (
              <p className="text-[11px] text-[#9b8b79] mt-4 leading-5">
                School records are not currently available for this district.
              </p>
            )}

            {facilityError && (
              <p className="text-xs text-[#a16a5e] mt-3">
                {facilityError}
              </p>
            )}
          </div>

          {/* DATA COVERAGE */}
          <div className="bg-[#edf1ec] rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f9385]">
              Geographic coverage
            </p>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <div>
                <p className="text-xl font-semibold text-[#405d50]">01</p>
                <p className="text-[10px] text-[#81958a]">State</p>
              </div>

              <div>
                <p className="text-xl font-semibold text-[#405d50]">31</p>
                <p className="text-[10px] text-[#81958a]">Districts</p>
              </div>

              <div>
                <p className="text-xl font-semibold text-[#405d50]">240</p>
                <p className="text-[10px] text-[#81958a]">Taluks</p>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT MAP PANEL */}
        <div className="min-w-0 bg-white border border-[#e8e7e1] rounded-2xl overflow-hidden">

          {/* MAP HEADER */}
          <div className="p-5 md:p-6 border-b border-[#eeede8]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#87998e] font-semibold">
                  <Layers size={14} />
                  Geographic explorer
                </div>

                <h2 className="serif-heading text-2xl text-[#263e52] mt-2">
                  {areaName}
                </h2>

                <p className="text-xs text-[#929c9e] mt-1">
                  {boundaryTitles[boundaryType]}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {boundaryOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setBoundaryType(option.value)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                      boundaryType === option.value
                        ? "bg-[#344e68] text-white"
                        : "bg-[#f6f6f2] text-[#71808c] hover:bg-[#eaece7]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAP TOOLBAR */}
          <div className="px-5 md:px-6 py-3 border-b border-[#eeede8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#718477]">
              <span className="w-2 h-2 rounded-full bg-[#789b82]" />
              Administrative boundaries
            </div>

            <div className="flex items-center gap-2 bg-[#f7f7f3] border border-[#e8e7e1] rounded-lg px-3 py-2 sm:w-64">
              <Search size={14} className="text-[#98a3aa] shrink-0" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search school locations"
                className="bg-transparent outline-none text-xs text-[#34465a] placeholder:text-[#a4adb3] w-full"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-[#9aa5ac]"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* MAP STATUS */}
          <div className="px-5 md:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-[#7e8b91]">
              {schoolData?.data_available
                ? `${mappedSchoolCount.toLocaleString("en-IN")} mapped school locations`
                : "School location data unavailable for this district"}
            </p>

            <p className="text-xs text-[#9aa3a5]">
              {loading
                ? "Loading boundaries..."
                : error
                  ? "Boundary data unavailable"
                  : `${boundaryData?.features?.length || 0} geographic features`}
            </p>
          </div>

          {error && (
            <div className="mx-5 md:mx-6 mb-3 flex items-start gap-2 bg-[#f8eeec] text-[#9a5d54] text-xs p-3 rounded-lg">
              <Info size={15} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* LEAFLET MAP */}
          <div className="px-3 md:px-5 pb-4">
            <div className="rounded-xl overflow-hidden border border-[#e4e7e3] relative">
              <MapContainer
                center={DEFAULT_CENTER}
                zoom={7}
                scrollWheelZoom={true}
                style={{
                  height: "min(70vh, 680px)",
                  minHeight: "460px",
                  width: "100%",
                  background: "#edf0ed",
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController
                  selectedFeature={activeFeature}
                  boundaryType={boundaryType}
                />

                {boundaryData && (
                  <GeoJSON
                    key={`${boundaryType}-${selectedDistrictCode}-${selectedTaluk}`}
                    data={boundaryData}
                    style={getFeatureStyle}
                    onEachFeature={onEachBoundary}
                  />
                )}

                {filteredSchools.map((school, index) => (
                  <Marker
                    key={school.school_id || `${school.school_name}-${index}`}
                    position={[
                      Number(school.latitude),
                      Number(school.longitude),
                    ]}
                  >
                    <Popup>
                      <div className="min-w-40">
                        <h3 className="font-semibold text-sm">
                          {school.school_name || "School"}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          {school.category || "School category unavailable"}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          Management: {school.management || "Not specified"}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {school.block || ""}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* MAP LEGEND */}
          <div className="px-5 md:px-6 pb-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex items-center gap-2 text-[11px] text-[#87939b]">
              <span className="w-3 h-3 rounded-sm border border-[#9aa9b5] bg-[#dce5e9]" />
              Boundary
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#87939b]">
              <span className="w-3 h-3 rounded-sm border border-[#496b83] bg-[#a9c1ce]" />
              Selected area
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#87939b]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d97757]" />
              School location
            </div>
          </div>
        </div>
      </section>

      {/* DATA NOTE */}
      <div className="flex items-start gap-3 border-t border-[#e9e8e2] pt-4">
        <Info size={15} className="text-[#8a9c90] shrink-0 mt-0.5" />

        <p className="text-[11px] text-[#8b9699] leading-5">
          METRIX displays processed administrative boundaries, available
          hospital records and geolocated school records. Data availability
          varies by district. Missing records are not treated as zero, and
          displayed counts do not independently establish infrastructure
          accessibility or service coverage.
        </p>
      </div>
    </div>
  );
}

export default CityMapping;