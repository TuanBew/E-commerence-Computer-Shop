# api-gateway/src/main.py

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Computer Components E-commerce API Gateway")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, limit this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs
SERVICE_URLS = {
    "user": os.getenv("USER_SERVICE_URL", "http://localhost:3001"),
    "product": os.getenv("PRODUCT_SERVICE_URL", "http://localhost:3002"),
    "review": os.getenv("REVIEW_SERVICE_URL", "http://localhost:3003"),
    "cart": os.getenv("CART_SERVICE_URL", "http://localhost:3004"),
    "order": os.getenv("ORDER_SERVICE_URL", "http://localhost:3005"),
    "admin": os.getenv("ADMIN_SERVICE_URL", "http://localhost:3006"),
    "notification": os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:3007"),
}

@app.get("/")
async def root():
    return {"message": "Computer Components E-commerce API Gateway"}

@app.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy_endpoint(service: str, path: str, request: Request):
    if service not in SERVICE_URLS:
        raise HTTPException(status_code=404, detail=f"Service '{service}' not found")
        
    target_url = f"{SERVICE_URLS[service]}/{path}"
    
    # Get request body if any
    body = await request.body()
    
    # Get request headers
    headers = dict(request.headers)
    headers.pop("host", None)  # Remove host header
    
    # Forward the request to the target service
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=body,
                params=request.query_params,
            )
            
            return response.json()
        except httpx.RequestError as exc:
            raise HTTPException(status_code=503, detail=f"Service unavailable: {exc}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)