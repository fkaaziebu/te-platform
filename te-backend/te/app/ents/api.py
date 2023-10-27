from fastapi import APIRouter

from app.ents.application.endpoints import router as application_router
from app.ents.user.endpoints import router as user_router
from app.ents.user.auth import router as login_router
from app.ents.company.endpoints import router as company_router
from app.ents.problem.endpoints import router as problem_router


api_router = APIRouter()

api_router.include_router(login_router, tags=["User Login"])
api_router.include_router(user_router, tags=["User Endpoints"])

api_router.include_router(company_router, tags=["Company Endpoints"])
api_router.include_router(application_router, tags=["Application Endpoints"])

api_router.include_router(problem_router, tags=["Problem Endpoints"])
