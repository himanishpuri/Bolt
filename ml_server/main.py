from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.tools import YouTubeSearchTool
import ast

from models import QueryRequest, ChatResponse, StocksQueryRequest, NewsChatResponse, YouTubeResponse, AnalysisResponse
from utils import send_query

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat", response_model=ChatResponse)
async def chatbot(request: QueryRequest):
    try:
        query = request.query + " Answer only if the question is from stocks, commodities, and trading, otherwise don't answer."
        answer = send_query(request.external_user_id, query, "general")
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stock-news", response_model=NewsChatResponse)
async def stock_news(request: StocksQueryRequest):
    try:
        query = f"Provide news summary and sentiment analysis for {request.stocks_name} stocks"
        
        answer = send_query(request.external_user_id, query, "news_analysis")
        
        # Split the response into summary and sentiment
        lines = answer.strip().split('\n')
        if len(lines) >= 2:
            summary = lines[0].strip()
            sentiment = lines[-1].strip().lower()
        else:
            summary = answer.strip()
            sentiment = "neutral"

        return NewsChatResponse(summary=summary, sentiment=sentiment)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/videos", response_model=YouTubeResponse)
async def videos(request: StocksQueryRequest):
    try:
        tool = YouTubeSearchTool()
        results = tool.run(request.stocks_name + ", 5")
        videos = ast.literal_eval(results)
        return YouTubeResponse(videos=videos)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/portfolio-analyser", response_model=AnalysisResponse)
async def portfolio_analyser(request: StocksQueryRequest):
    try:
        query = f"Analyze the following portfolio and provide insights: {request.stocks_name}"
        
        answer = send_query(request.external_user_id, query, "portfolio_analysis")

        return AnalysisResponse(report=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8001)
