from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from .settings import settings

_client: MongoClient | None = None

def get_client() -> MongoClient:
    global _client
    if _client is None:
        if settings.MONGODB_URI:
            _client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=3000)
        else:
            _client = MongoClient(serverSelectionTimeoutMS=3000)
    return _client

def get_db(db_name: str = "careerai"):
    client = get_client()
    return client[db_name]

# Simple health check

def ping_db() -> bool:
    try:
        get_client().admin.command('ping')
        return True
    except ConnectionFailure:
        return False
