"""
Start point of the web server
"""
# Library imports
from waitress import serve

# Module imports
from app import app
import os

# Is this a production environment?
PRODUCTION = False

'''
Main - Starts service
'''
if __name__ == '__main__':
    if PRODUCTION:
        # Serves as web server
        serve(app, host='0.0.0.0', port=80)
    else:
        # Runs as dev server, should be on localhost 5000

        # OAuth2 requires https, so for development, we can turn the check off
        os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
        app.run()
