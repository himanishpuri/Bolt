const express = require('express');
const axios = require('axios');
const Portfolio = require('../models/Portfolio');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Chat Session for News Analysis
router.get('/chat-session', optionalAuth, async (req, res) => {
  try {
    // Get external user ID
    const externalUserId = req.user ? req.user._id.toString() : 'anonymous';

    // Get user's areas of interest
    let userAreasOfInterest = [];
    if (req.user && req.user.areasOfInterest) {
      userAreasOfInterest = req.user.areasOfInterest;
    } else {
      // Default interests if not authenticated or no interests set
      userAreasOfInterest = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    }

    // API configuration
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'API key not configured'
      });
    }

    const createSessionHeaders = {
      'apikey': apiKey,
      'Content-Type': 'application/json'
    };

    const responses = [];

    // Process each area of interest
    for (const interest of userAreasOfInterest) {
      try {
        // Step 1: Create Chat Session
        const createSessionUrl = 'https://api.on-demand.io/chat/v1/sessions';
        const createSessionBody = {
          pluginIds: [],
          externalUserId: externalUserId
        };

        const sessionResponse = await axios.post(createSessionUrl, createSessionBody, {
          headers: createSessionHeaders
        });

        if (!sessionResponse.data || !sessionResponse.data.data) {
          responses.push({
            interest: interest,
            error: 'Failed to create chat session'
          });
          continue;
        }

        const sessionId = sessionResponse.data.data.id;

        // Step 2: Submit Query
        const submitQueryUrl = `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`;
        const submitQueryBody = {
          endpointId: "predefined-openai-gpt4o",
          query: `You are a bot whose job is to provide the summary of the news of a given stock in 1 paragraph only. After this perform sentiment analysis on the summary and return the answer as positive, negative, or neutral (only 1 word).\n${interest} stocks news`,
          pluginIds: ["plugin-1712327325", "plugin-1713962163", "plugin-1729887147"],
          responseMode: "sync"
        };

        const queryResponse = await axios.post(submitQueryUrl, submitQueryBody, {
          headers: createSessionHeaders
        });

        if (!queryResponse.data || !queryResponse.data.data) {
          responses.push({
            interest: interest,
            error: 'Failed to submit query'
          });
        } else {
          const answer = queryResponse.data.data.answer;
          responses.push({
            interest: interest,
            answer: answer
          });
        }

      } catch (error) {
        console.error(`Error processing interest ${interest}:`, error.message);
        responses.push({
          interest: interest,
          error: `API request failed: ${error.message}`
        });
      }
    }

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
    const externalUserId = req.user ? req.user._id.toString() : 'anonymous';

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'API key not configured'
      });
    }

    const createSessionHeaders = {
      'apikey': apiKey,
      'Content-Type': 'application/json'
    };

    // Create Chat Session
    const createSessionUrl = 'https://api.on-demand.io/chat/v1/sessions';
    const createSessionBody = {
      pluginIds: [],
      externalUserId: externalUserId
    };

    const sessionResponse = await axios.post(createSessionUrl, createSessionBody, {
      headers: createSessionHeaders
    });

    if (!sessionResponse.data || !sessionResponse.data.data) {
      return res.status(500).json({
        error: 'Failed to create chat session'
      });
    }

    const sessionId = sessionResponse.data.data.id;

    // Submit Query for specific ticker
    const submitQueryUrl = `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`;
    const submitQueryBody = {
      endpointId: "predefined-openai-gpt4o",
      query: `You are a bot whose job is to provide the summary of the news of a given stock in 1 paragraph only. After this perform sentiment analysis on the summary and return the answer as positive, negative, or neutral (only 1 word).\n${ticker} stocks news`,
      pluginIds: ["plugin-1712327325", "plugin-1713962163", "plugin-1729887147"],
      responseMode: "sync"
    };

    const queryResponse = await axios.post(submitQueryUrl, submitQueryBody, {
      headers: createSessionHeaders
    });

    if (!queryResponse.data || !queryResponse.data.data) {
      return res.status(500).json({
        error: 'Failed to get news analysis'
      });
    }

    res.json({
      ticker: ticker.toUpperCase(),
      analysis: queryResponse.data.data.answer
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
    const externalUserId = req.user ? req.user._id.toString() : 'anonymous';

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'API key not configured'
      });
    }

    const createSessionHeaders = {
      'apikey': apiKey,
      'Content-Type': 'application/json'
    };

    // Get sentiment for each popular stock
    const sentimentResults = [];

    for (const stock of popularStocks.slice(0, 5)) { // Limit to 5 to avoid rate limiting
      try {
        // Create session
        const createSessionUrl = 'https://api.on-demand.io/chat/v1/sessions';
        const createSessionBody = {
          pluginIds: [],
          externalUserId: externalUserId
        };

        const sessionResponse = await axios.post(createSessionUrl, createSessionBody, {
          headers: createSessionHeaders
        });

        if (sessionResponse.data && sessionResponse.data.data) {
          const sessionId = sessionResponse.data.data.id;

          // Get sentiment
          const submitQueryUrl = `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`;
          const submitQueryBody = {
            endpointId: "predefined-openai-gpt4o",
            query: `Analyze the current market sentiment for ${stock} stock and return only one word: positive, negative, or neutral`,
            pluginIds: ["plugin-1712327325", "plugin-1713962163", "plugin-1729887147"],
            responseMode: "sync"
          };

          const queryResponse = await axios.post(submitQueryUrl, submitQueryBody, {
            headers: createSessionHeaders
          });

          if (queryResponse.data && queryResponse.data.data) {
            sentimentResults.push({
              ticker: stock,
              sentiment: queryResponse.data.data.answer.toLowerCase().trim()
            });
          }
        }
      } catch (error) {
        console.error(`Error getting sentiment for ${stock}:`, error.message);
        sentimentResults.push({
          ticker: stock,
          sentiment: 'neutral',
          error: 'Failed to fetch sentiment'
        });
      }
    }

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