'''
User's model for database

@author Matthew Schofield
@version 9.12.2020
'''
# Module imports
from app import db

# Models imports
from app.models.historical_survey_model import HistoricalSurvey

class Survey(db.Model):
    '''
    Column definitions

    '''
    # Column definitions
    surveyId = db.Column(db.Integer(), db.ForeignKey("historical_survey.historicalSurveyId"),  primary_key=True)
    active = db.Column(db.Boolean())
    question = db.Column(db.String(120))
    answerA = db.Column(db.String(120))
    answerB = db.Column(db.String(120))
    answerC = db.Column(db.String(120))
    answerD = db.Column(db.String(120))
    answerE = db.Column(db.String(120))

    # Set-up Database Relationships
