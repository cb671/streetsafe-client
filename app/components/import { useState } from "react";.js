import { useState } from 'react';
import '../app';

export default function TrendFilter({ onClose }) {
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('');
  const [startDate, setStartDate] = useState('2020-04-01');
  const [endDate, setEndDate] = useState('2025-04-01');
  const [crimeTypes, setCrimeTypes] = useState([]);

  const crimeOptions = ['Burglary', 'Vehicle', 'Violent'];

  const toggleCrimeType = (type) => {
    setCrimeTypes((prev) =>
      prev.includes(type) ? prev.filter((c) => c !== type) : [...prev, type]
    );
  };

  const handleFilter = () => {
    console.log({
      location,
      radius,
      startDate,
      endDate,
      crimeTypes,
    });
    // 🔗 Replace with API call
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-grey bg-opacity-60'>
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
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='Hinted search text'
            className='w-full p-2 rounded-lg bg-gray-800 text-white outline-none'
          />
        </div>

        {/* Radius */}
        <div className='mb-4'>
          <label className='block text-sm mb-1'>Radius (KM)</label>
          <input
            type='number'
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
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
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className='p-2 rounded-lg bg-gray-800 text-white outline-none flex-1'
            />
            <span>-</span>
            <input
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
                  checked={crimeTypes.includes(crime)}
                  onChange={() => toggleCrimeType(crime)}
                />
                {crime}
              </label>
            ))}
          </div>
        </div>

        {/* Filter Button */}
        <button
          onClick={handleFilter}
          className='bg-white text-black font-semibold rounded-xl py-2'
        >
          Filter
        </button>
      </div>
    </div>
  );
}
