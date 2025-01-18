import React, { useEffect } from 'react';
import './Home.css';
import ChartBox from '../components/charts/ChartBox.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChartData } from '../redux/chartDataSlice.ts';
import { RootState, AppDispatch } from '../redux/store.ts';


const Home = () => {
    const dispatch: AppDispatch = useDispatch();
    const chartData = useSelector((state: RootState) => state.chartData.data);
    const isLoading = useSelector((state: RootState) => state.chartData.loading);
    const error = useSelector((state: RootState) => state.chartData.error);
  
    useEffect(() => {
      if (!chartData) {
        dispatch(fetchChartData());
      }
    }, [chartData]);
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


  return (
    <div className="home">
      <div className="grids">
      <div className="pieChart">
         <ChartBox chartType="pie" title="User Satisfaction" />
        </div>
        <div className = "lineCharts">
        <div className="lineChart">
        <ChartBox chartType="line" title="Daily Response Times" color="#42ca9d" />
        </div>
        <div className="lineChart">
        <ChartBox chartType="line" title="Weekly Response Times" color="#850c8d" />
        </div>
        <div className="areaGrp">
        <ChartBox chartType="StackedAreaChart" title="Response times Stacked Area" />
        </div>
        </div>
        <div className="box">
        <ChartBox chartType="bar" title="Category Distribution" color="#8884d8" />
        </div>
        <div className="box">
        <ChartBox chartType="NeedleGaugeChart" title="Platform Statistics" />
        </div>
        <div className="box">
        <ChartBox chartType="ComposedChart" title="Statistics By country" />
        </div>
      </div>
    </div>
  );
};

export default Home;

