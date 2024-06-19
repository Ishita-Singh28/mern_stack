import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [month, setMonth] = useState('03');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const perPage = 10;

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await axios.get(`http://localhost:5000/api/products/transactions`, {
                params: { month, search, page, perPage }
            });
            setTransactions(response.data.transactions);
            setTotal(response.data.total);
        };
        fetchTransactions();
    }, [month, search, page]);

    return (
        <div>
            <select onChange={(e) => setMonth(e.target.value)} value={month}>
                {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m, index) => (
                    <option key={index} value={m}>{m}</option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Search transactions"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date of Sale</th>
                        <th>Sold</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                            <td>{transaction.sold ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <button onClick={() => setPage(page + 1)} disabled={page * perPage >= total}>Next</button>
            </div>
        </div>
    );
};

export default TransactionsTable;
