from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader
from backend.core.config import settings

api_key_header = APIKeyHeader(name="X-ADMIN-KEY", auto_error=False)

async def get_current_admin(api_key: str = Security(api_key_header)):
    """
    Validate admin API key from header.
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials"
        )
    
    if api_key != settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid admin credentials"
        )
    
    return True
