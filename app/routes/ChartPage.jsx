import Bar from '../components/BarChart';
import PieChart from '../components/PieChart';
import LineChart from '../components/LineChart';
import '../app.css';

const ChartPage = () => {
  return (
    <>
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
        <Bar className='border border-white' />
      </div>
      <div
        className='bg-grey'
        style={{
          border: '2px solid #fff', // White border
          borderRadius: '12px', // Rounded corners
          padding: '16px',
          width: '350px',
          height: '350px', // Smaller widt             // Smaller height          // Optional: dark background
          margin: '30px auto',
        }}
      >
        <PieChart />
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
        <LineChart />
      </div>
    </>
  );
};

export default ChartPage;
