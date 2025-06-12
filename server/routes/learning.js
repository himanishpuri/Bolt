const express = require('express');
const axios = require('axios');
const { query, validationResult } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const geminiService = require('../utils/gemini');

const router = express.Router();

// YouTube Search Tool API equivalent
router.get('/youtube-search', authenticateToken, [
  query('company_name').notEmpty().withMessage('Company name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { company_name } = req.query;

    // YouTube Data API v3 search
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    if (!youtubeApiKey) {
      // Fallback: return mock educational content URLs
      const mockResults = [
        `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+stock+analysis`,
        `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+investment+guide`,
        `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+financial+education`,
        `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+market+analysis`,
        `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+trading+tips`
      ];

      return res.json(mockResults);
    }

    try {
      // Use YouTube Data API v3 to search for educational content
      const searchUrl = 'https://www.googleapis.com/youtube/v3/search';
      const searchParams = {
        part: 'snippet',
        maxResults: 5,
        q: `${company_name} stock investment education analysis`,
        type: 'video',
        key: youtubeApiKey,
        order: 'relevance',
        videoDuration: 'medium' // Filter for medium length videos (4-20 minutes)
      };

      const response = await axios.get(searchUrl, { params: searchParams });

      if (response.data && response.data.items) {
        const videoLinks = response.data.items.map(item => 
          `https://www.youtube.com/watch?v=${item.id.videoId}`
        );
        
        res.json(videoLinks);
      } else {
        // Fallback to search query URLs if API response is empty
        const fallbackResults = [
          `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+stock+analysis`,
          `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+investment+guide`,
          `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+financial+education`,
          `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+market+analysis`,
          `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+trading+tips`
        ];
        
        res.json(fallbackResults);
      }

    } catch (apiError) {
      console.error('YouTube API error:', apiError.message);
      
      // Fallback to search query URLs if API fails
      const fallbackResults = [
        `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+stock+analysis`,
        `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+investment+guide`,
        `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+financial+education`,
        `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+market+analysis`,
        `https://www.youtube.com/results?search_query=${encodeURIComponent(company_name)}+trading_tips`
      ];
      
      res.json(fallbackResults);
    }

  } catch (error) {
    console.error('YouTube search error:', error);
    res.status(500).json({
      error: `Failed to retrieve search results: ${error.message}`
    });
  }
});

// Educational Chat Session (similar to news but focused on learning)
router.get('/educational-chat', optionalAuth, async (req, res) => {
  try {
    const { topic } = req.query;

    // Default educational topics if none provided
    const educationalTopics = topic ? [topic] : [
      'stock market basics',
      'investment strategies',
      'risk management',
      'financial planning',
      'portfolio diversification'
    ];

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key not configured'
      });
    }

    // Process each educational topic using Gemini
    const responses = await geminiService.processMultipleEducationalTopics(educationalTopics);

    res.json({
      educational_content: responses
    });

  } catch (error) {
    console.error('Educational chat error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Get learning resources for specific investment concepts
router.get('/resources/:concept', async (req, res) => {
  try {
    const { concept } = req.params;

    // Predefined learning resources
    const learningResources = {
      'stocks': {
        title: 'Stock Market Basics',
        description: 'Learn the fundamentals of stock investing',
        resources: [
          {
            type: 'article',
            title: 'What are Stocks?',
            url: 'https://www.investopedia.com/terms/s/stock.asp'
          },
          {
            type: 'video',
            title: 'Stock Market for Beginners',
            url: 'https://youtube.com/watch?v=example'
          },
          {
            type: 'course',
            title: 'Stock Investing 101',
            url: 'https://example-learning-platform.com/stocks-101'
          }
        ]
      },
      'bonds': {
        title: 'Bond Investing',
        description: 'Understanding fixed-income securities',
        resources: [
          {
            type: 'article',
            title: 'Bond Basics',
            url: 'https://www.investopedia.com/terms/b/bond.asp'
          },
          {
            type: 'video',
            title: 'How Bonds Work',
            url: 'https://youtube.com/watch?v=example'
          }
        ]
      },
      'portfolio': {
        title: 'Portfolio Management',
        description: 'Learn how to build and manage investment portfolios',
        resources: [
          {
            type: 'article',
            title: 'Portfolio Diversification',
            url: 'https://www.investopedia.com/terms/d/diversification.asp'
          },
          {
            type: 'video',
            title: 'Portfolio Construction',
            url: 'https://youtube.com/watch?v=example'
          }
        ]
      },
      'risk': {
        title: 'Risk Management',
        description: 'Understanding and managing investment risk',
        resources: [
          {
            type: 'article',
            title: 'Investment Risk Types',
            url: 'https://www.investopedia.com/terms/r/risk.asp'
          },
          {
            type: 'video',
            title: 'Risk vs Return',
            url: 'https://youtube.com/watch?v=example'
          }
        ]
      }
    };

    const conceptResource = learningResources[concept.toLowerCase()];
    
    if (!conceptResource) {
      return res.status(404).json({
        error: 'Learning resources not found for this concept',
        available_concepts: Object.keys(learningResources)
      });
    }

    res.json(conceptResource);

  } catch (error) {
    console.error('Learning resources error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Get personalized learning recommendations based on user's interests
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const userInterests = user.areasOfInterest || [];

    // Generate learning recommendations based on user's stock interests
    const recommendations = [];

    for (const interest of userInterests.slice(0, 3)) { // Limit to top 3 interests
      recommendations.push({
        category: 'Stock Analysis',
        title: `Learn about ${interest} stock`,
        description: `Deep dive into ${interest} company analysis and investment potential`,
        resources: [
          {
            type: 'youtube_search',
            query: `${interest} stock analysis tutorial`,
            url: `/learning/youtube-search?company_name=${encodeURIComponent(interest)}`
          },
          {
            type: 'educational_content',
            query: `${interest} investment guide`,
            url: `/learning/educational-chat?topic=${encodeURIComponent(`${interest} investment analysis`)}`
          }
        ]
      });
    }

    // Add general financial education recommendations
    recommendations.push(
      {
        category: 'Financial Fundamentals',
        title: 'Portfolio Diversification',
        description: 'Learn how to build a well-diversified investment portfolio',
        resources: [
          {
            type: 'concept',
            url: '/learning/resources/portfolio'
          }
        ]
      },
      {
        category: 'Risk Management',
        title: 'Understanding Investment Risk',
        description: 'Learn to identify and manage investment risks effectively',
        resources: [
          {
            type: 'concept',
            url: '/learning/resources/risk'
          }
        ]
      }
    );

    res.json({
      user_id: user._id,
      recommendations: recommendations,
      total_recommendations: recommendations.length
    });

  } catch (error) {
    console.error('Learning recommendations error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Learning progress tracking (mock implementation)
router.post('/progress', authenticateToken, async (req, res) => {
  try {
    const { resource_type, resource_id, completion_status, time_spent } = req.body;

    // In a real implementation, you would save this to a learning progress model
    const progressData = {
      user_id: req.user._id,
      resource_type,
      resource_id,
      completion_status,
      time_spent: time_spent || 0,
      completed_at: new Date()
    };

    // Mock response - in real app, save to database
    res.status(201).json({
      message: 'Learning progress recorded successfully',
      progress: progressData
    });

  } catch (error) {
    console.error('Learning progress error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router; 