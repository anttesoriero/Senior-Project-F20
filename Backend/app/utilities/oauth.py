import requests
from oauthlib.oauth2 import WebApplicationClient

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID = "984254031044-1iv965nannlt69gal3ra624qgf4d4uof.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "UcMRiOX4xAW4K0j4j73gtniF"
GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)

# OAuth 2 client setup
client = WebApplicationClient(GOOGLE_CLIENT_ID)

def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()