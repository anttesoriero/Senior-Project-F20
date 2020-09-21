"""
Initialize Flask application architecture

@authors: Matthew Schofield
@version: 9.11.2020
"""
# Library imports
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

# Init app
app = Flask(__name__)

# Set up

# Setup the JWT configuration
app.config['JWT_SECRET_KEY'] = 'cmkf34LFMEl3iwp4fmna342'
jwtManager = JWTManager(app)

# Setup the database connection
DB_USER = "oddjobsuser"
DB_PASSWORD = "asdllM$o2pecfsEEA"
DB_NAME = "oddjobs"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://" + DB_USER + ":" + DB_PASSWORD + "@127.0.0.1/" + DB_NAME + "?host=localhost?port=3306"
db = SQLAlchemy(app)

'''
The blueprints must be loaded in last as the configurations to the JWT manager and Database
must be completed first
'''
# Blueprint imports
from app.routes.main import main_blueprint
from app.routes.auth import auth_blueprint
from app.routes.user import user_blueprint
from app.routes.me import me_blueprint
from app.routes.errors import errors_blueprint

# Load in modules "Blueprints"
app.register_blueprint(main_blueprint, url_prefix="/main")
app.register_blueprint(auth_blueprint, url_prefix="/auth")
app.register_blueprint(user_blueprint, url_prefix="/user")
app.register_blueprint(me_blueprint, url_prefix="/me")
app.register_blueprint(errors_blueprint)

# Init database with referenced models from routes
db.create_all()
