const express = require('express');
const { body, query, validationResult } = require('express-validator');
const yahooFinance = require('yahoo-finance2').default;
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Portfolio = require('../models/Portfolio');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper function to get stock data
const getStockData = async (symbols, startDate, endDate) => {
  try {
    const results = {};
    for (const symbol of symbols) {
      const data = await yahooFinance.historical(symbol, {
        period1: startDate,
        period2: endDate,
        interval: '1d'
      });
      results[symbol] = data;
    }
    return results;
  } catch (error) {
    throw new Error(`Failed to fetch stock data: ${error.message}`);
  }
};

// Helper function to calculate moving averages
const calculateMovingAverages = (prices, smaWindow = 10, emaWindow = 10) => {
  const result = prices.map((price, index) => {
    const item = {
      date: price.date,
      adjClose: price.adjClose,
      sma: null,
      ema: null
    };

    // Calculate SMA
    if (index >= smaWindow - 1) {
      const smaSum = prices.slice(index - smaWindow + 1, index + 1)
        .reduce((sum, p) => sum + p.adjClose, 0);
      item.sma = smaSum / smaWindow;
    }

    // Calculate EMA
    if (index === emaWindow - 1) {
      // First EMA value is the SMA
      const smaSum = prices.slice(0, emaWindow).reduce((sum, p) => sum + p.adjClose, 0);
      item.ema = smaSum / emaWindow;
    } else if (index > emaWindow - 1) {
      // EMA = (Close - EMA_prev) * (2 / (N + 1)) + EMA_prev
      const multiplier = 2 / (emaWindow + 1);
      const prevEma = result[index - 1].ema;
      item.ema = (price.adjClose - prevEma) * multiplier + prevEma;
    }

    return item;
  });

  return result;
};

// Portfolio Performance (Backtesting)
router.get('/backtesting', [
  query('companies').notEmpty().withMessage('Companies are required'),
  query('amounts').notEmpty().withMessage('Investment amounts are required'),
  query('end_date').optional().isISO8601().withMessage('Invalid end date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let { companies, amounts, end_date } = req.query;
    
    // Parse arrays from query params
    companies = Array.isArray(companies) ? companies : [companies];
    amounts = Array.isArray(amounts) ? amounts : [amounts];

    if (companies.length !== amounts.length) {
      return res.status(400).json({
        error: 'Each company must have a corresponding investment amount.'
      });
    }

    // Convert amounts to numbers
    amounts = amounts.map(amount => parseFloat(amount));
    const totalInvestment = amounts.reduce((sum, amount) => sum + amount, 0);

    // Calculate weights
    const weights = amounts.map(amount => amount / totalInvestment);

    // Date range
    const startDate = '2015-01-01';
    const endDate = end_date || new Date().toISOString().split('T')[0];

    // Get stock data
    const stockData = await getStockData(companies, startDate, endDate);

    // Calculate portfolio performance
    const dates = [];
    const portfolioValues = [];
    const dailyReturns = [];
    const cumulativeReturns = [];

    let allDates = new Set();
    Object.values(stockData).forEach(data => {
      data.forEach(item => allDates.add(item.date.toISOString().split('T')[0]));
    });

    allDates = Array.from(allDates).sort();

    let previousPortfolioValue = totalInvestment;
    let cumulativeReturn = 0;

    allDates.forEach((date, index) => {
      let portfolioValue = 0;
      let hasAllData = true;

      companies.forEach((symbol, i) => {
        const dayData = stockData[symbol]?.find(d => 
          d.date.toISOString().split('T')[0] === date
        );
        
        if (dayData) {
          portfolioValue += weights[i] * dayData.adjClose * (totalInvestment / 100); // Normalized
        } else {
          hasAllData = false;
        }
      });

      if (hasAllData) {
        const dailyReturn = index > 0 ? (portfolioValue - previousPortfolioValue) / previousPortfolioValue : 0;
        cumulativeReturn = index === 0 ? 0 : ((portfolioValue - totalInvestment) / totalInvestment);

        dates.push(date);
        portfolioValues.push(portfolioValue);
        dailyReturns.push(dailyReturn);
        cumulativeReturns.push(cumulativeReturn);

        previousPortfolioValue = portfolioValue;
      }
    });

    res.json({
      dates,
      portfolio_value: portfolioValues,
      daily_return: dailyReturns,
      cumulative_return: cumulativeReturns
    });

  } catch (error) {
    console.error('Backtesting error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Moving Averages
router.get('/moving-averages/:ticker', [
  query('start_date').notEmpty().withMessage('Start date is required'),
  query('end_date').notEmpty().withMessage('End date is required'),
  query('sma_window').optional().isInt({ min: 1 }).withMessage('SMA window must be a positive integer'),
  query('ema_window').optional().isInt({ min: 1 }).withMessage('EMA window must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { ticker } = req.params;
    const { start_date, end_date, sma_window = 10, ema_window = 10 } = req.query;

    // Get historical data
    const data = await yahooFinance.historical(ticker, {
      period1: start_date,
      period2: end_date,
      interval: '1d'
    });

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: 'No data found for the given ticker and date range.'
      });
    }

    // Calculate moving averages
    const result = calculateMovingAverages(
      data.map(d => ({ date: d.date, adjClose: d.adjClose })),
      parseInt(sma_window),
      parseInt(ema_window)
    );

    res.json(result);

  } catch (error) {
    console.error('Moving averages error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Top Stocks (from CSV data)
router.get('/top-stocks', async (req, res) => {
  try {
    // For now, return hardcoded data as in the Django version
    // In production, you would read from a CSV file or database
    const topHigh = {
      "Monopar Therapeutics Inc. (MNPR)": "605.40%",
      "Nxu Inc. (NXU)": "139.15%",
      "Nexalin Technology Inc. Warrant (NXLIW)": "114.29%",
      "1847 Holdings LLC (EFSH)": "109.26%"
    };
    
    const topLow = {
      "Marinus Pharmaceuticals Inc. (MRNS)": "-82.49%",
      "Lilium N.V. Warrants (LILMW)": "-78.80%",
      "Orangekloud Technology Inc. (ORKT)": "-75.69%",
      "Vision Sensing Acquisition Corp. Warrants (VSACW)": "-72.73%"
    };

    res.json({
      top_high: topHigh,
      top_low: topLow
    });

  } catch (error) {
    console.error('Top stocks error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Get sector for a symbol
router.get('/sector/:symbol', (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Sector mapping (simplified version)
    const sectorMap = {
      'AAPL': 'Technology',
      'MSFT': 'Technology',
      'GOOGL': 'Technology',
      'AMZN': 'Consumer Discretionary',
      'TSLA': 'Consumer Discretionary',
      'NVDA': 'Technology',
      'JPM': 'Finance',
      'JNJ': 'Health Care',
      'V': 'Finance',
      'PG': 'Consumer Staples'
      // Add more mappings as needed
    };

    const sector = sectorMap[symbol.toUpperCase()] || 'Unknown';

    res.json({
      symbol: symbol.toUpperCase(),
      sector
    });

  } catch (error) {
    console.error('Sector lookup error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Portfolio CRUD operations
router.get('/portfolios', authenticateToken, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ 
      user: req.user._id, 
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json(portfolios);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.post('/portfolios', authenticateToken, [
  body('name').notEmpty().withMessage('Portfolio name is required'),
  body('description').optional().isString(),
  body('items').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const portfolioData = {
      ...req.body,
      user: req.user._id
    };

    const portfolio = new Portfolio(portfolioData);
    await portfolio.save();

    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get('/portfolios/:id', authenticateToken, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!portfolio) {
      return res.status(404).json({
        error: 'Portfolio not found'
      });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.put('/portfolios/:id', authenticateToken, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!portfolio) {
      return res.status(404).json({
        error: 'Portfolio not found'
      });
    }

    Object.assign(portfolio, req.body);
    await portfolio.save();

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.delete('/portfolios/:id', authenticateToken, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!portfolio) {
      return res.status(404).json({
        error: 'Portfolio not found'
      });
    }

    portfolio.isActive = false;
    await portfolio.save();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router; 