import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState({ totalSaleAmount: 0, soldItems: 0, notSoldItems: 0 });

    useEffect(() => {
        const fetchStatistics = async () => {
            const response = await axios.get(`http://localhost:5000/api/products/statistics`, {
                params: { month }
            });
            setStatistics(response.data);
        };
        fetchStatistics();
    }, [month]);

    return (
        <div>
            <h2>Statistics for month: {month}</h2>
            <p>Total Sale Amount: {statistics.totalSaleAmount}</p>
            <p>Total Sold Items: {statistics.soldItems}</p>
            <p>Total Not Sold Items: {statistics.notSoldItems}</p>
        </div>
    );
};

export default Statistics;
