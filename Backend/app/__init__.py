"""
Initialize Flask application architecture

@authors: Matthew Schofield
@version: 9.11.2020
"""
# Library imports
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Init app
app = Flask(__name__)
#Cors setup to allow requests from frontend
CORS(app)

# Init app
app = Flask(__name__)

# Set up

# Setup the JWT configuration
app.config['JWT_SECRET_KEY'] = 'cmkf34LFMEl3iwp4fmna342'
jwtManager = JWTManager(app)
blacklist = set()

# Function to invalidate a JWT token, used in logouts
@jwtManager.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist

# Setup the database connection
DB_USER = "oddjobsuser"
DB_PASSWORD = "asdllM$o2pecfsEEA"
DB_NAME = "oddjobs"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://" + DB_USER + ":" + DB_PASSWORD + "@localhost/" + DB_NAME + "?host=127.0.0.1?port=3306"
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
from app.routes.survey import survey_blueprint
from app.routes.task import task_blueprint
from app.routes.admin import admin_blueprint

# Load in modules "Blueprints"
app.register_blueprint(main_blueprint, url_prefix="/main")
app.register_blueprint(auth_blueprint, url_prefix="/auth")
app.register_blueprint(user_blueprint, url_prefix="/user")
app.register_blueprint(me_blueprint, url_prefix="/me")
app.register_blueprint(task_blueprint, url_prefix="/task")
app.register_blueprint(survey_blueprint, url_prefix="/survey")
app.register_blueprint(admin_blueprint, url_prefix="/admin")
app.register_blueprint(errors_blueprint)

# Init database with referenced models from routes
db.create_all()

#Initial load of Category table
from app.models.category_model import Category
if Category.empty():
    file = open("./app/models/initializers/initialCategories.txt", 'r')
    for categoryName in file.read().split("\n"):
        category = Category(categoryName=categoryName)
        db.session.add(category)
    db.session.commit()
    file.close()

#Initial load of Survey table
from app.models.survey_model import Survey
if Survey.empty():
    file = open("./app/models/initializers/initialSurvey.txt", 'r')
    for survey in file.read().split("\n"):
        Survey.createSurvey(survey.split(";"))
    file.close()
