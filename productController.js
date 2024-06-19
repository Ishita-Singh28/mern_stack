const axios = require('axios');
const Product = require('../models/Product');

// Initialize Database
exports.initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const products = response.data;
        await Product.deleteMany({});
        await Product.insertMany(products);
        res.status(200).send('Database initialized with seed data');
    } catch (error) {
        res.status(500).send('Error initializing database');
    }
};

// List Transactions
exports.listTransactions = async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const query = {
        dateOfSale: {
            $gte: new Date(`2022-${month}-01`),
            $lte: new Date(`2022-${month}-31`)
        }
    };
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: parseFloat(search) }
        ];
    }
    const transactions = await Product.find(query)
        .skip((page - 1) * perPage)
        .limit(parseInt(perPage));
    const total = await Product.countDocuments(query);
    res.status(200).json({ transactions, total });
};

// Statistics
exports.getStatistics = async (req, res) => {
    const { month } = req.query;
    const query = {
        dateOfSale: {
            $gte: new Date(`2022-${month}-01`),
            $lte: new Date(`2022-${month}-31`)
        }
    };
    const totalSaleAmount = await Product.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const soldItems = await Product.countDocuments({ ...query, sold: true });
    const notSoldItems = await Product.countDocuments({ ...query, sold: false });
    res.status(200).json({
        totalSaleAmount: totalSaleAmount[0]?.total || 0,
        soldItems,
        notSoldItems
    });
};

// Bar Chart
exports.getBarChart = async (req, res) => {
    const { month } = req.query;
    const query = {
        dateOfSale: {
            $gte: new Date(`2022-${month}-01`),
            $lte: new Date(`2022-${month}-31`)
        }
    };
    const ranges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        { range: '201-300', min: 201, max: 300 },
        { range: '301-400', min: 301, max: 400 },
        { range: '401-500', min: 401, max: 500 },
        { range: '501-600', min: 501, max: 600 },
        { range: '601-700', min: 601, max: 700 },
        { range: '701-800', min: 701, max: 800 },
        { range: '801-900', min: 801, max: 900 },
        { range: '901-above', min: 901, max: Infinity }
    ];
    const result = await Promise.all(ranges.map(async range => {
        const count = await Product.countDocuments({
            ...query,
            price: { $gte: range.min, $lte: range.max }
        });
        return { range: range.range, count };
    }));
    res.status(200).json(result);
};

// Pie Chart
exports.getPieChart = async (req, res) => {
    const { month } = req.query;
    const query = {
        dateOfSale: {
            $gte: new Date(`2022-${month}-01`),
            $lte: new Date(`2022-${month}-31`)
        }
    };
    const result = await Product.aggregate([
        { $match: query },
        { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.status(200).json(result);
};

// Combined Data
exports.getCombinedData = async (req, res) => {
    const { month } = req.query;
    const [statistics, barChart, pieChart] = await Promise.all([
        exports.getStatistics(req, res),
        exports.getBarChart(req, res),
        exports.getPieChart(req, res)
    ]);
    res.status(200).json({ statistics, barChart, pieChart });
};
