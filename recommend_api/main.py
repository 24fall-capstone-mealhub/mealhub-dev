from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.recommend import router as recommend_router
from api.feedback import router as feedback_router

app = FastAPI(
    root_path="/api",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 개발 서버 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 추천 API 엔드포인트 등록
app.include_router(recommend_router, prefix="/recommend", tags=["recommend"])
app.include_router(feedback_router, prefix="/feedback", tags=["feedback"])