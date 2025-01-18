import React from 'react';
import toast from 'react-hot-toast';
import { IconType } from 'react-icons';
import {
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
  ComposedChart,
  ResponsiveContainer,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store.ts';
import './ChartBox.css';

interface ChartBoxProps {
  chartType: string;
  color?: string;
  IconBox?: IconType;
  title?: string;
  dataKey?: string;
  isLoading?: boolean;
  isSuccess?: boolean;
}

const ChartBox: React.FC<ChartBoxProps> = ({ chartType, title, color, IconBox }) => {
  const chartData = useSelector((state: RootState) => state.chartData.data);
  const isLoading = useSelector((state: RootState) => state.chartData.loading);

  if (isLoading) {
    return (
      <div className="loadingContainer">
        <span className="title">{title}</span>
        <div className="skeletonChart"></div>
      </div>
    );
  }

  if (!chartData) {
    console.log("cahartdata ", chartData)
    return <div>Error: No data available</div>;
  }


  if (chartType === 'bar') {
    const categoryData = Object.entries(chartData.category_distribution || {})
      .map(([name, value]) => ({
        name: name || 'Unnamed',
        value: value ?? 0,
      }))
      .filter(item => item.value > 0);
  
    console.log("Raw category_distribution:", chartData.category_distribution);
    console.log("Mapped Category Data:", categoryData);
  
    return (
      <div className="successContainer">
        <span className="title">{title}</span>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              content={({ payload }) => {
                console.log("Tooltip Payload:", payload);
                if (payload && payload.length) {
                  const { name, value } = payload[0]?.payload || {};
                  return (
                    <div
                      style={{
                        background: color || '#8884d8',
                        color: 'white',
                        padding: '5px',
                        borderRadius: '5px',
                      }}
                    >
                      <p>{`Name: ${name}`}</p>
                      <p>{`Value: ${value}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" fill={color || '#8884d8'} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  

  if (chartType === 'line') {
    const responseTimes =
      title === 'Daily Response Times'
        ? chartData.response_times.day_wise
        : chartData.response_times.week_wise;

    const xAxisKey = title === 'Daily Response Times' ? 'date' : 'week';

    return (
      <div className="successContainer">
        <span className="title">{title}</span>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={responseTimes}>
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip
              contentStyle={{
                background: color,
                border: 'none',
                color: 'white',
                borderRadius: '8px',
                paddingTop: '0px',
                paddingBottom: '0px',
              }}
              itemStyle={{ color: 'white' }}
              labelStyle={{ display: 'none' }}
            />
            <Line
              type="monotone"
              dataKey="average_time"
              stroke={color || '#82ca9d'}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === "StackedAreaChart") {
    const dayWiseData = chartData.response_times.day_wise.map((item) => ({
      name: item.date,
      daily_time: item.average_time,
    }));

    const weekWiseData = chartData.response_times.week_wise.map((item) => ({
      name: `Week ${item.week}`,
      weekly_time: item.average_time,
    }));

    const responseTimes = [...dayWiseData, ...weekWiseData];


    // Custom Tooltip Component
    interface CustomTooltipProps {
      active?: boolean;
      payload?: any[];
    }

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0];
        const color = data.stroke || data.fill;
        return (
          <div
            style={{
              background: color,
              color: 'white',
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
            }}
          >
            <p style={{ margin: 0 }}>{data.name}</p>
            <p style={{ margin: 0 }}>{`${data.dataKey}: ${data.value}`}</p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="successContainer">
        <span className="title">{title}</span>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={responseTimes}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            {/* Define stacked areas */}
            <Area
              type="monotone"
              dataKey="daily_time"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="weekly_time"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }


  if (chartType === 'pie') {
    const satisfactionData = chartData.user_satisfaction.ratings.map((item, index) => ({
      name: `Rating ${item.rating}`,
      value: item.count,
      color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4560'][index % 5],
    }));
    return (
      <>
        <div className="successContainer">
          <span className="title">{title}</span>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={satisfactionData}
                innerRadius="70%"
                outerRadius="90%"
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {satisfactionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="container">
          {satisfactionData.map((item) => (
            <div className="item" key={item.name}>
              <div className="item-inner">
                <div
                  className="item-circle"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
              <span>({item.value})</span>
            </div>
          ))}
        </div>
      </>
    );

  }

  if (chartType === 'NeedleGaugeChart') {
    const platformData = Object.entries(chartData.usage_statistics.by_platform).map(
      ([name, value]) => ({
        name,
        value,
        color: name === 'iOS' ? '#ff0000' : name === 'Android' ? '#00ff00' : '#0000ff', // Assigning colors dynamically
      })
    );

    const cx = 150; // Center X-coordinate
    const cy = 200; // Center Y-coordinate
    const iR = 50;
    const oR = 100;

    // Calculate total value for the needle
    const totalValue = platformData.reduce((acc, item) => acc + item.value, 0);
    const needleValue = platformData[0]?.value;

    // Function to draw the needle
    const needle = (value: number, data: any[], cx: number, cy: number, iR: number, oR: number, color: string | undefined) => {
      const total = data.reduce((acc, item) => acc + item.value, 0);
      const angle = 180.0 * (1 - value / total);
      const length = (iR + 2 * oR) / 3;
      const RADIAN = Math.PI / 180;
      const sin = Math.sin(-RADIAN * angle);
      const cos = Math.cos(-RADIAN * angle);
      const r = 5; // Needle circle radius
      const x0 = cx;
      const y0 = cy;
      const xba = x0 + r * sin;
      const yba = y0 - r * cos;
      const xbb = x0 - r * sin;
      const ybb = y0 + r * cos;
      const xp = x0 + length * cos;
      const yp = y0 + length * sin;

      return [
        <circle key="circle" cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
        <path
          key="path"
          d={`M${xba} ${yba}L${xbb} ${ybb}L${xp} ${yp}L${xba} ${yba}`}
          stroke="none"
          fill={color}
        />,
      ];
    };

    return (
      <>
        <div className="successContainer">
          <span className="title">{title}</span>
          <ResponsiveContainer width={400} height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={platformData}
                cx={cx}
                cy={cy}
                innerRadius={iR}
                outerRadius={oR}
                fill="#8884d8"
                stroke="none"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {needle(needleValue, platformData, cx, cy, iR, oR, '#d0d000')}

            </PieChart>
            <Tooltip
              contentStyle={{ backgroundColor: '#333', borderRadius: '8px', color: 'white' }}
              itemStyle={{ color: 'white' }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '20px' }}
            />
          </ResponsiveContainer>
        </div>
      </>
    );
  }

  if (chartType === 'ComposedChart') {
    const usageStatistics = Object.entries(chartData.usage_statistics.by_country).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    return (
      <div className="successContainer">
        <span className="title">{title}</span>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={usageStatistics}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" scale="band" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey="value" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};

export default ChartBox;
