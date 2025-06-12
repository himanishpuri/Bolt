const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
	constructor() {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) {
			throw new Error("GEMINI_API_KEY environment variable is required");
		}

		this.genAI = new GoogleGenerativeAI(apiKey);
		this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
	}

	/**
	 * Generate stock news analysis and sentiment
	 * @param {string} ticker - Stock ticker symbol
	 * @returns {Promise<string>} - Analysis with sentiment
	 */
	async getStockNewsAnalysis(ticker) {
		try {
			const prompt = `You are a financial analyst bot. Provide a summary of recent news for ${ticker} stock in 1 paragraph only. After the summary, perform sentiment analysis and return the sentiment as one word: positive, negative, or neutral. Format your response as:

ANALYSIS: [Your analysis paragraph here]
SENTIMENT: [positive/negative/neutral]`;

			const result = await this.model.generateContent(prompt);
			const response = await result.response;
			return response.text();
		} catch (error) {
			console.error(
				`Error getting stock news analysis for ${ticker}:`,
				error,
			);
			throw new Error(`Failed to get news analysis: ${error.message}`);
		}
	}

	/**
	 * Generate market sentiment for a stock
	 * @param {string} ticker - Stock ticker symbol
	 * @returns {Promise<string>} - Sentiment (positive/negative/neutral)
	 */
	async getMarketSentiment(ticker) {
		try {
			const prompt = `Analyze the current market sentiment for ${ticker} stock based on recent market trends, news, and performance. Return only one word: positive, negative, or neutral.`;

			const result = await this.model.generateContent(prompt);
			const response = await result.response;
			return response.text().toLowerCase().trim();
		} catch (error) {
			console.error(`Error getting market sentiment for ${ticker}:`, error);
			return "neutral"; // Default fallback
		}
	}

	/**
	 * Generate educational content about financial topics
	 * @param {string} topic - Educational topic
	 * @returns {Promise<string>} - Educational content
	 */
	async getEducationalContent(topic) {
		try {
			const prompt = `You are an educational financial advisor. Provide a comprehensive but concise explanation about "${topic}" for someone learning about investing. Include key concepts, practical tips, and important considerations. Keep it educational and informative. Write in a clear, easy-to-understand manner.`;

			const result = await this.model.generateContent(prompt);
			const response = await result.response;
			return response.text();
		} catch (error) {
			console.error(
				`Error getting educational content for ${topic}:`,
				error,
			);
			throw new Error(`Failed to get educational content: ${error.message}`);
		}
	}

	/**
	 * Process multiple stocks for news analysis
	 * @param {string[]} tickers - Array of stock ticker symbols
	 * @returns {Promise<Object[]>} - Array of analysis results
	 */
	async processMultipleStocks(tickers) {
		const results = [];

		for (const ticker of tickers) {
			try {
				const analysis = await this.getStockNewsAnalysis(ticker);
				results.push({
					interest: ticker,
					answer: analysis,
				});
			} catch (error) {
				results.push({
					interest: ticker,
					error: `Failed to analyze ${ticker}: ${error.message}`,
				});
			}
		}

		return results;
	}

	/**
	 * Process multiple stocks for sentiment analysis
	 * @param {string[]} tickers - Array of stock ticker symbols
	 * @returns {Promise<Object[]>} - Array of sentiment results
	 */
	async processMultipleSentiments(tickers) {
		const results = [];

		for (const ticker of tickers) {
			try {
				const sentiment = await this.getMarketSentiment(ticker);
				results.push({
					ticker: ticker,
					sentiment: sentiment,
				});
			} catch (error) {
				console.error(`Error processing sentiment for ${ticker}:`, error);
				results.push({
					ticker: ticker,
					sentiment: "neutral",
					error: "Failed to fetch sentiment",
				});
			}
		}

		return results;
	}

	/**
	 * Process multiple educational topics
	 * @param {string[]} topics - Array of educational topics
	 * @returns {Promise<Object[]>} - Array of educational content results
	 */
	async processMultipleEducationalTopics(topics) {
		const results = [];

		for (const topic of topics) {
			try {
				const content = await this.getEducationalContent(topic);
				results.push({
					topic: topic,
					content: content,
				});
			} catch (error) {
				console.error(
					`Error processing educational topic ${topic}:`,
					error,
				);
				results.push({
					topic: topic,
					error: `Educational content request failed: ${error.message}`,
				});
			}
		}

		return results;
	}
}

// Create a singleton instance
const geminiService = new GeminiService();

module.exports = geminiService;
