from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.utils.settings import settings
from backend.api.routes import router as api_router
from backend.api.auth_routes import router as auth_router
from backend.api.progress_routes import router as progress_router

app = FastAPI(title="CareerAI Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(api_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(progress_router, prefix="/api")

@app.get("/")
def root():
    return {"service": "careerai", "status": "ok"}
