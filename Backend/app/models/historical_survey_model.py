'''


@author Matthew Schofield
@version 10.16.2020
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
    surveyId = db.Column(db.Integer(), nullable=False)
    response = db.Column(db.Integer(), nullable=False)

    @classmethod
    def createHistoricalSurvey(cls, userId, surveyId, response):
        historicalSurvey = HistoricalSurvey(userId=userId, surveyId=surveyId, response=response)

        # Save survey response to database
        db.session.add(historicalSurvey)
        db.session.commit()
        return historicalSurvey