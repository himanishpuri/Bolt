import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# User conversation history for maintaining context
user_conversations = {}

def get_or_create_conversation(external_user_id: str):
    """Get or create a conversation history for a user"""
    if external_user_id not in user_conversations:
        print("Creating new conversation")
        user_conversations[external_user_id] = []
    else:
        print("Using existing conversation")
    return user_conversations[external_user_id]

def send_query(external_user_id: str, query: str, context_type: str = "general"):
    """Send a query to Gemini API with conversation context"""
    try:
        # Get conversation history
        conversation = get_or_create_conversation(external_user_id)
        
        # Create the model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Add context based on the type of query
        system_prompt = get_system_prompt(context_type)
        full_query = f"{system_prompt}\n\nUser Query: {query}"
        
        # Generate response
        response = model.generate_content(full_query)
        
        # Store conversation history
        conversation.append({"user": query, "assistant": response.text})
        
        # Keep only last 10 exchanges to manage memory
        if len(conversation) > 10:
            conversation = conversation[-10:]
            user_conversations[external_user_id] = conversation
        
        return response.text
        
    except Exception as e:
        print(f"Error in send_query: {str(e)}")
        raise e

def get_system_prompt(context_type: str) -> str:
    """Get system prompt based on context type"""
    prompts = {
        "general": """You are a knowledgeable financial assistant specializing in stocks, commodities, and trading. 
        Only answer questions related to finance, investments, stock market, commodities, trading strategies, and economic analysis. 
        If the question is not related to these topics, politely decline to answer and redirect the user to ask finance-related questions.""",
        
        "news_analysis": """You are a financial news analyst. Your job is to:
        1. Provide a concise summary of recent news for the given stock in exactly one paragraph
        2. Perform sentiment analysis on the summary
        3. Return the sentiment as exactly one word: positive, negative, or neutral
        
        Format your response as:
        [Summary paragraph]
        [Sentiment word]""",
        
        "portfolio_analysis": """You are a portfolio analysis expert. Analyze the given stocks and provide:
        1. Strengths and weaknesses of the current portfolio
        2. Risk assessment
        3. Diversification analysis
        4. Recommendations for improvement
        5. Suggested alternative or additional stocks
        
        Provide detailed insights and actionable recommendations."""
    }
    
    return prompts.get(context_type, prompts["general"])
