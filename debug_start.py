
import sys
import os
import traceback

# Add project root to sys.path
sys.path.append(os.getcwd())

print("Attempting to import backend.main...")
try:
    from backend.main import app, lifespan
    print("Successfully imported backend.main")
except Exception:
    traceback.print_exc()
    sys.exit(1)

print("Attempting to run startup logic...")
import asyncio

async def run_startup():
    try:
        # Simulate lifespan startup
        async with lifespan(app):
            print("Startup complete.")
    except Exception:
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(run_startup())
