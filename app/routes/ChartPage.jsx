import Bar from '../components/BarChart';
import PieChart from '../components/PieChart';
import LineChart from '../components/LineChart';
import { ListFilter } from 'lucide-react';
import '../app.css';
import TrendFilter from '../components/TrendFilter';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';

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
      <Sidebar />
      <div className='relative h-full px-4 flex flex-col gap-4 text-whiteish'>
        <div className='bg-black/75 text-whiteish flex justify-end border-2 border-whiteish/30 rounded-xl p-4 mx-auto w-full'>
          <ListFilter
            style={{ cursor: 'pointer' }}
            onClick={() => setShowFilter(!showFilter)}
          />
        </div>
        <div className='bg-black/75 border-2 border-whiteish/30 rounded-xl p-4 mx-auto w-full h-96'>
          <Bar className='border border-white' filter={filter} />
        </div>
        <div className='bg-black/75 border-2 border-whiteish/30 rounded-xl p-4 mx-auto w-full h-auto'>
          <PieChart filter={filter} />
        </div>
        <div className='bg-black/75 border-2 border-whiteish/30 rounded-xl p-4 mx-auto w-full'>
          <LineChart filter={filter} />
        </div>
        {showFilter && (
          <TrendFilter
            filter={filter}
            handleFilter={handleFilter}
            onClose={() => setShowFilter(false)}
          />
        )}
      </div>
    </>
  );
};

export default ChartPage;
