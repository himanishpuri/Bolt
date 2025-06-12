const express = require('express');
const axios = require('axios');
const Portfolio = require('../models/Portfolio');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const geminiService = require('../utils/gemini');

const router = express.Router();

// Chat Session for News Analysis
router.get('/chat-session', optionalAuth, async (req, res) => {
  try {
    // Get user's areas of interest
    let userAreasOfInterest = [];
    if (req.user && req.user.areasOfInterest) {
      userAreasOfInterest = req.user.areasOfInterest;
    } else {
      // Default interests if not authenticated or no interests set
      userAreasOfInterest = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    }

    // Check if Gemini API key is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key not configured'
      });
    }

    // Process each area of interest using Gemini
    const responses = await geminiService.processMultipleStocks(userAreasOfInterest);

    res.json({
      responses: responses
    });

  } catch (error) {
    console.error('Chat session error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Portfolio List/Create
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

router.post('/portfolios', authenticateToken, async (req, res) => {
  try {
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

// Portfolio Detail (Retrieve/Update/Delete)
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

// Stock news analysis for specific ticker
router.get('/stock-news/:ticker', optionalAuth, async (req, res) => {
  try {
    const { ticker } = req.params;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key not configured'
      });
    }

    // Get analysis using Gemini
    const analysis = await geminiService.getStockNewsAnalysis(ticker);

    res.json({
      ticker: ticker.toUpperCase(),
      analysis: analysis
    });

  } catch (error) {
    console.error('Stock news error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Market sentiment overview
router.get('/market-sentiment', optionalAuth, async (req, res) => {
  try {
    const popularStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'JPM', 'JNJ'];

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key not configured'
      });
    }

    // Get sentiment for each popular stock using Gemini
    const sentimentResults = await geminiService.processMultipleSentiments(
      popularStocks.slice(0, 5) // Limit to 5 to avoid rate limiting
    );

    res.json({
      market_sentiment: sentimentResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Market sentiment error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router; 