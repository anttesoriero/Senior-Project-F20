"""
Defines routes for the auth (Authentication) endpoints

Try to use utilities outside of this file to do the heavy lifting
This file should be focused on annotating routes

@author Matthew Schofield
@version 11.11.2020
"""
# Library imports
from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_raw_jwt
import datetime

# Module imports
from app.routes.auth import auth_blueprint
from app.utilities.validation.validation import validateRequestJSON
from app import blacklist

# Database Models
from app.models.user_model import User


'''
Open endpoints
@auth_blueprint.route('/oauth')
def oauth_login():
    # Set up a Google provider
    google_provider_cfg = get_google_provider_cfg()

    # We want to hit the provider's 'authorization' URL
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # Use library to construct the request for login and provide
    # scopes that let you retrieve user's profile from Google
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )
    # Redirect to the /oauth/callback route
    # GCP wanted a callback route when the client is ready
    return redirect(request_uri)

@auth_blueprint.route("/oauth/callback")
def oauth_callback():
    # Get authorization code that Google sent back to you
    code = request.args.get("code")

    # Find out what URL to hit to get tokens that allow you to ask for
    # things on behalf of a user
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # Prepare and send request to get tokens
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code,
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    # Parse the tokens
    client.parse_request_body_response(json.dumps(token_response.json()))

    # Now that we have tokens, find and hit URL from Google that gives
    # user's profile information, including their Google Profile Image and Email
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    # We want to make sure their email is verified.
    # The user authenticated with Google, authorized our
    # app, and now we've verified their email through Google
    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        picture = userinfo_response.json()["picture"]
        users_name = userinfo_response.json()["given_name"]
        family_name = userinfo_response.json()["family_name"]
    else:
        return "User email not available or not verified by Google.", 400

    # At this point, we will create the user and send them a JWT token

    # Create user
    user = User.createUser(
        email = users_email,
        password = unique_id,
        firstName = users_name,
        lastName = family_name,
        preferredName = "",
        # TODO : add "picture" column to the user table
        phoneNumber = ""
    )

    # Check user created
    if user is not None:
        # Generate and return JWT token
        access_token = create_access_token(identity=user.userId)
        response = {
            'success': True,
            'access_token': access_token
        }
        return jsonify(response), 200
    else:
        # Failed to register
        response = {
            'success': False
        }
        return jsonify(response), 400
'''

@auth_blueprint.route('/login', methods=['POST'])
def login():
    '''
    OPEN endpoint

    Standard login endpoint, given a User's authentication parameters
    return a JWT authentication token.

    In:
    {
        email: str, user's email
        password: str, user's password
    }

    Out:
    Success
    {
        access_token: str, JWT access token
        success: bool
    }

    HTTP codes:
    401 - Login failed
    200 - OK
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, ["email", "password"], [])

    if not success:
        return jsonify({}), code

    # Get User
    user = User.getByEmail(inputJSON["email"])

    # If user exists check their credentials
    if user and user.checkCredentials(inputJSON["password"]):
        # Generate JWT token
        access_token = create_access_token(identity=user.userId, expires_delta=datetime.timedelta(days=1))
        return jsonify({"success":True, "access_token": access_token}), 200
    else:
        # Send back error
        return jsonify({"success": False}), 401

@auth_blueprint.route('/register', methods=['POST'])
def register():
    '''
    OPEN Endpoint

    Register a new user

    In:
    {
        email: str, new user's email
        password: str, new user's password
    }

    Out:
    Success
    {
        access_token: str, JWT access token
        success: bool
    }

    HTTP codes:
    200 - OK
    400 - Bad
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, ["email", "password"],
                                                   ["firstName", "lastName", "preferredName", "phoneNumber"])
    if not success:
        return jsonify({}), code

    # Create user
    user = User.createUser(
        email=inputJSON["email"],
        password=inputJSON["password"],
        firstName = inputJSON["firstName"],
        lastName = inputJSON["lastName"],
        preferredName = inputJSON["preferredName"],
        phoneNumber = inputJSON["phoneNumber"]
    )

    # Check user created
    if user is not None:
        # Generate and return JWT token
        access_token = create_access_token(identity=user.userId, expires_delta=datetime.timedelta(days=1))
        response = {
            'success': True,
            'access_token': access_token
        }
        return jsonify(response), 200
    else:
        # Failed to register
        response = {
            'success': False
        }
        return jsonify(response), 400

@auth_blueprint.route('/forgotPassword', methods=['POST'])
def forgotPassword():
    '''
    Open Endpoint

    A user has forgotten password

    In
    {
        "email": str, user's email
    }

    Out
    {
        "success": bool, email sent
    }
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, ["email"], [])
    if not success:
        return jsonify({}), code

    return jsonify({"success": True}), 200

@auth_blueprint.route('/changePasswordFromVerification', methods=['POST'])
def changePasswordFromVerification():
    '''
    Open Endpoint

    Change a user's password using a verification token

    :param:
    {
        "email": str, user's email,
        "verificationToken": str, token sent to user's email,
        "password": str, user's new password
    }

    :return:
    {
        "success": bool, email sent
    }
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, ["email", "verificationToken", "password"], [])
    if not success:
        return jsonify({}), code

    return jsonify({"success": True}), 200

'''
Protected endpoints
'''
@auth_blueprint.route('/logout', methods=['GET'])
@jwt_required
def logout():
    '''
    *

    Closed Endpoint

    Logout a user

    In
    None

    Out
    {
        "success": bool, whether user was logged out
    }
    '''
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"success": True}), 200


@auth_blueprint.route('/changePasswordWithAuth', methods=['POST'])
@jwt_required
def changePasswordWithAuth():
    '''
    Closed Endpoint

    Change an authenticated User's password

    :param:
    {
        "oldPassword": str, old password
        "newPassword": str, new password
    }

    :return:
    {
        "success": bool, whether user's password was changed
    }
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, ["oldPassword", "newPassword"], [])
    if not success:
        return jsonify({}), code

    # get User
    user = User.getByUserId(get_jwt_identity())

    # Check that the user and password are valid
    if user and user.checkCredentials(inputJSON["oldPassword"]):
        # Change password
        user.setPassword(inputJSON["newPassword"])
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False}), 401

