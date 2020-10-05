'''


@author Matthew Schofield
@version 9.22.2020
'''
# Library imports
from werkzeug.security import generate_password_hash, check_password_hash

# Module imports
from app import db



class HistoricalSurvey(db.Model):
    '''
    Column definitions

    '''

    historicalSurveyId = db.Column(db.Integer(), primary_key=True)
    userId = db.Column(db.Integer(), db.ForeignKey("user.userId"))
    surveyId = db.Column(db.Integer())
    response = db.Column(db.Integer(), nullable=False)

    survey = db.relationship('Survey', backref="historical_survey", uselist=False)

