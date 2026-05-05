from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routers import auth, cloud

# Khởi tạo ứng dụng FastAPI
app = FastAPI(
    title="Cloud Box API",
    description="Hệ thống lưu trữ ghi chú và liên kết cá nhân",
    version="1.0.0"
)

# Cấu hình CORS để Frontend có thể gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong thực tế nên thay bằng URL của Frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đưa các Router vào hệ thống chính
app.include_router(auth.router)
app.include_router(cloud.router)

@app.get("/")
async def root():
    return {
        "message": "Server của Nhựt đã sẵn sàng!",
        "docs": "/docs",
        "health": "OK"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Cloud Box Backend"}

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)