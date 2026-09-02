import { useState } from "react";
import { useEffect } from "react";

export default function TrendFilter({ filter, handleFilter, onClose }) {
  const [localFilter, setLocalFilter] = useState(filter);
  const handleChanges = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "crimeTypes") {
      setLocalFilter((prev) => ({
        ...prev,
        crimeTypes: checked
          ? [...prev.crimeTypes, value]
          : prev.crimeTypes.filter((c) => c !== value),
      }));
    } else {
      setLocalFilter({
        ...localFilter,
        [name]: value,
      });
    }
  };

  const handleApply = () => {
    handleFilter(localFilter);
  };

  const crimeOptions = [
    { value: "burglary", label: "Burglary" },
    { value: "personal_theft", label: "Personal Theft" },
    { value: "weapon_crime", label: "Weapon Crime" },
    { value: "bicycle_theft", label: "Bicycle Theft" },
    { value: "damage", label: "Damage" },
    { value: "robbery", label: "Robbery" },
    { value: "shoplifting", label: "Shoplifting" },
    { value: "violent", label: "Violent" },
    { value: "anti_social", label: "Anti Social" },
    { value: "drugs", label: "Drugs" },
    { value: "vehicle_crime", label: "Vehicle Crime" },
  ];

  console.log(localFilter);
  return (
    <div className="fixed inset-x-0 bottom-0 top-16 md:top-28 z-50 flex items-center justify-center overflow-y-auto p-4 bg-black/10 backdrop-blur-2xl">
      <div className="relative flex max-h-full w-full max-w-md flex-col overflow-y-auto rounded-xl bg-black/75 p-6 text-white shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-2xl hover:text-gray-400"
        >
          &times;
        </button>

        <div className="mb-4 pr-8">
          <h2 className="text-lg font-semibold">Filter crime trends</h2>

          <p className="mt-1 text-sm text-whiteish/75">
            Choose a location, date range, radius, and crime types to customise
            the trends shown in the charts.
          </p>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Location</label>
          <input
            type="text"
            value={localFilter.location}
            onChange={handleChanges}
            name="location"
            placeholder="Enter a location"
            className="w-full p-2 rounded-lg bg-lightgrey  text-white outline-none"
          />
        </div>

        {/* Radius */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Radius</label>
          <input
            type="number"
            value={localFilter.radius}
            onChange={handleChanges}
            name="radius"
            placeholder="Enter radius"
            className="w-full p-2 rounded-lg bg-lightgrey  text-white outline-none"
          />
        </div>

        {/* Date Range */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Date</label>
          <div className="flex gap-2 items-center text-sm">
            <input
              type="date"
              value={localFilter.startDate}
              onChange={handleChanges}
              name="startDate"
              className="p-2 rounded-lg bg-lightgrey  text-white outline-none flex-1"
            />
            <span>-</span>
            <input
              type="date"
              value={localFilter.endDate}
              onChange={handleChanges}
              name="endDate"
              className="p-2 rounded-lg bg-lightgrey  text-white outline-none flex-1"
            />
          </div>
        </div>

        {/* Crime Types */}
        <div className="mb-6">
          <label className="block text-sm mb-2">Crime</label>
          <div className="flex flex-col gap-2">
            {crimeOptions.map((crime) => (
              <label key={crime.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localFilter.crimeTypes.includes(crime.value)}
                  onChange={handleChanges}
                  name="crimeTypes"
                  value={crime.value}
                />
                {crime.label}
              </label>
            ))}
          </div>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => handleFilter(localFilter)}
          className="bg-lightgrey text-whiteish font-semibold rounded-xl py-2"
        >
          Filter
        </button>
      </div>
    </div>
  );
}
