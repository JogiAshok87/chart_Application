import React, { useEffect, useState, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import html2canvas from 'html2canvas';
import '../index.css'

const Chart = () => {
  const [data, setData] = useState([]);
  const [timeframe, setTimeframe] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for zooming functionality
  const [left, setLeft] = useState('dataMin');
  const [right, setRight] = useState('dataMax');
  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [top, setTop] = useState('dataMax+1');
  const [bottom, setBottom] = useState('dataMin-1');
  const [top2, setTop2] = useState('dataMax+20');
  const [bottom2, setBottom2] = useState('dataMin-20');
  const [animation, setAnimation] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('https://3dd739c0-3e49-4bd7-9cc1-7e9bd15ab167.mock.pstmn.io/api/data')
      .then(response => response.json())
      .then(data => {
        console.log('Parsed data:', data);
        // Ensure data is in the correct format
        const formattedData = data.map(item => ({
          timestamp: new Date(item.timestamp).toISOString(),
          value: Number(item.value)
        }));
        setData(formattedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching or parsing data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);
 
  // Handle click on data point
  const handleClick = (data) => {
    alert(`Value: ${data.value} at ${data.timestamp}`);
  };

  // Format X-axis ticks
  const formatXAxis = (tickItem) => {
    return new Date(tickItem).toLocaleDateString();
  };

  // Export chart as image
  const exportChart = () => {
    html2canvas(document.querySelector(".recharts-wrapper")).then(canvas => {
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };
 
  // Filter data based on selected timeframe
  const filterDataByTimeframe = (data) => {
    if (data.length === 0) return data;
    const latestDate = new Date(Math.max(...data.map(d => new Date(d.timestamp))));
    switch(timeframe) {
      case 'daily':
        return data.filter(item => new Date(item.timestamp) >= new Date(latestDate - 24*60*60*1000));
      case 'weekly':
        return data.filter(item => new Date(item.timestamp) >= new Date(latestDate - 7*24*60*60*1000));
      case 'monthly':
        return data.filter(item => new Date(item.timestamp) >= new Date(latestDate - 30*24*60*60*1000));
      default:
        return data;
    }
  };

  // Zooming functionality
  const zoom = () => {
    let { refAreaLeft, refAreaRight } = this.state;
    const { data } = this.state;

    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      this.setState(() => ({
        refAreaLeft: '',
        refAreaRight: '',
      }));
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight) {
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
    }

    // yAxis domain
    const [bottom, top] = getAxisYDomain(refAreaLeft, refAreaRight, 'value', 1);

    this.setState(() => ({
      refAreaLeft: '',
      refAreaRight: '',
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top,
    }));
  };

  const zoomOut = () => {
    const { data } = this.state;
    this.setState(() => ({
      data: data.slice(),
      refAreaLeft: '',
      refAreaRight: '',
      left: 'dataMin',
      right: 'dataMax',
      top: 'dataMax+1',
      bottom: 'dataMin',
    }));
  };

  const getAxisYDomain = (from, to, ref, offset) => {
    const refData = data.slice(from - 1, to);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });

    return [(bottom | 0) - offset, (top | 0) + offset];
  };
 
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const filteredData = filterDataByTimeframe(data);

  return (
    <div className="chart-container">
      <div className="buttons">
        <button onClick={() => setTimeframe('daily')}>Daily</button>
        <button onClick={() => setTimeframe('weekly')}>Weekly</button>
        <button onClick={() => setTimeframe('monthly')}>Monthly</button>
        <button onClick={exportChart}>Export</button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={filteredData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel)}
          onMouseMove={(e) => e && refAreaLeft && setRefAreaRight(e.activeLabel)}
          onMouseUp={zoom}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis}
            allowDataOverflow={true}
            domain={[left, right]}
          />
          <YAxis 
            allowDataOverflow={true}
            domain={[bottom, top]}
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ onClick: handleClick }} />
          {refAreaLeft && refAreaRight ? (
            <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
      
    </div>
  );
}

export default Chart;

