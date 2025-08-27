import Bar from '../components/BarChart';
import PieChart from '../components/PieChart';
import LineChart from '../components/LineChart';
import { ListFilter } from 'lucide-react';
import '../app.css';
import TrendFilter from '../components/TrendFilter.jsx';
import { useState } from 'react';

const ChartPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({
    startDate: '',
    location: '',
    radius: '',
    groupBy: 'year',
    crimeTypes: [],
  });

  // Called when user clicks Filter in TrendFilter
  const handleFilter = (newFilter) => {
    setFilter(newFilter);
    setShowFilter(false); // Close popup after applying
  };
  return (
    <>
      <div
        className='bg-grey text-whiteish flex justify-end'
        style={{
          border: '2px solid #fff',
          borderRadius: '12px',
          padding: '16px',
          width: '350px',
          margin: '30px auto',
        }}
      >
        <ListFilter
          style={{ cursor: 'pointer' }}
          onClick={() => setShowFilter(!showFilter)}
        />
      </div>
      <div
        className='bg-grey'
        style={{
          border: '2px solid #fff',
          borderRadius: '12px', // Rounded corners
          padding: '16px',
          width: '350px',
          height: '350px', // Smaller widt             // Smaller height          // Optional: dark background
          margin: '30px auto',
        }}
      >
        <Bar className='border border-white' filter={filter} height={350}/>
      </div>
      <div
        className='bg-grey'
        style={{
          border: '2px solid #fff', // White border
          borderRadius: '12px', // Rounded corners
          padding: '5px',
          width: '350px',
          height: '350px', // Smaller widt             // Smaller height          // Optional: dark background
          margin: '30px auto',
        }}
      >
        <PieChart filter={filter} />
      </div>
      <div
        className='bg-grey'
        style={{
          border: '2px solid #fff', // White border
          borderRadius: '12px', // Rounded corners
          padding: '16px',
          width: '350px', // Smaller widt             // Smaller height          // Optional: dark background
          margin: '30px auto',
        }}
      >
        <LineChart filter={filter} />
      </div>
      {showFilter && (
        <TrendFilter
          filter={filter}
          handleFilter={handleFilter}
          onClose={() => setShowFilter(false)}
        />
      )}
    </>
  );
};

export default ChartPage;
