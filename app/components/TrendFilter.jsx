import { useState } from 'react';
import { useEffect } from 'react';

export default function TrendFilter({ filter, handleFilter, onClose }) {
  const [localFilter, setLocalFilter] = useState(filter);
  const handleChanges = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'crimeTypes') {
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

  const crimeOptions = ['burglary', 'vehicle', 'violent'];

  console.log(localFilter);
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-grey bg-opacity-80'>
      <div className='relative bg-gray-900 text-white p-6 rounded-xl w-full max-w-md shadow-lg flex flex-col min-h-[500px]'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-white text-2xl hover:text-gray-400'
        >
          &times;
        </button>

        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Trends</h2>
        </div>

        {/* Location */}
        <div className='mb-4'>
          <label className='block text-sm mb-1'>Location</label>
          <input
            type='text'
            value={localFilter.location}
            onChange={handleChanges}
            name='location'
            placeholder='Hinted search text'
            className='w-full p-2 rounded-lg bg-gray-800 text-white outline-none'
          />
        </div>

        {/* Radius */}
        <div className='mb-4'>
          <label className='block text-sm mb-1'>Radius (KM)</label>
          <input
            type='number'
            value={localFilter.radius}
            onChange={handleChanges}
            name='radius'
            placeholder='Enter radius'
            className='w-full p-2 rounded-lg bg-gray-800 text-white outline-none'
          />
        </div>

        {/* Date Range */}
        <div className='mb-4'>
          <label className='block text-sm mb-1'>Date</label>
          <div className='flex gap-2 items-center'>
            <input
              type='date'
              value={localFilter.startDate}
              onChange={handleChanges}
              name='startDate'
              className='p-2 rounded-lg bg-gray-800 text-white outline-none flex-1'
            />
            <span>-</span>
            <input
              type='date'
              value={localFilter.endDate}
              onChange={handleChanges}
              name='endDate'
              className='p-2 rounded-lg bg-gray-800 text-white outline-none flex-1'
            />
          </div>
        </div>

        {/* Crime Types */}
        <div className='mb-6'>
          <label className='block text-sm mb-2'>Crime</label>
          <div className='flex flex-col gap-2'>
            {crimeOptions.map((crime) => (
              <label key={crime} className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={localFilter.crimeTypes.includes(crime)}
                  onChange={handleChanges}
                  name='crimeTypes'
                  value={crime}
                />
                {crime}
              </label>
            ))}
          </div>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => handleFilter(localFilter)}
          className='bg-white text-black font-semibold rounded-xl py-2'
        >
          Filter
        </button>
      </div>
    </div>
  );
}
