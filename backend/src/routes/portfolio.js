const router = require('express').Router();
const { getPortfolio, buyStock, sellStock, getTransactions } = require('../controllers/portfolioController');

// Routes using :userId param (backward compatible)
router.get('/:userId', getPortfolio);
router.get('/:userId/transactions', getTransactions);
router.post('/:userId/buy', buyStock);
router.post('/:userId/sell', sellStock);

// Shortcut routes using logged-in user from JWT token
router.get('/', (req, res, next) => { req.params.userId = req.userId; getPortfolio(req, res, next); });
router.get('/transactions', (req, res, next) => { req.params.userId = req.userId; getTransactions(req, res, next); });
router.post('/buy', (req, res, next) => { req.params.userId = req.userId; buyStock(req, res, next); });
router.post('/sell', (req, res, next) => { req.params.userId = req.userId; sellStock(req, res, next); });

module.exports = router;
