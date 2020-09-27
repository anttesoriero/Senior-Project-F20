'''
Survey's model for database

This stores static Surveys, a survey should never be removed or edited only disabled

@author Matthew Schofield
@version 9.25.2020
'''
# Module imports
from app import db

# Models imports
from app.models.historical_survey_model import HistoricalSurvey

class Survey(db.Model):
    '''
    Column definitions

    surveyId
    active
    question
    answerA
    answerB
    answerC
    answerD
    answerE
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
