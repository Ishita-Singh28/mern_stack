import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ month }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:5000/api/products/bar-chart`, {
                params: { month }
            });
            setData(response.data);
        };
        fetchData();
    }, [month]);

    const chartData = {
        labels: data.map(item => item.range),
        datasets: [
            {
                label: 'Number of Items',
                data: data.map(item => item.count),
                backgroundColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            }
        ]
    };

    return (
        <div>
            <h2>Bar Chart for month: {month}</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default BarChart;
