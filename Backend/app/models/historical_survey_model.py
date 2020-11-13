'''
Storage for Historical Surveys

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
    historicalSurveyId | Integer | PK
    userId             | Integer
    surveyId           | Integer
    response           | Integer
    '''
    historicalSurveyId = db.Column(db.Integer(), primary_key=True)
    userId = db.Column(db.Integer(), db.ForeignKey("user.userId"))
    surveyId = db.Column(db.Integer(), nullable=False)
    response = db.Column(db.String(1), nullable=False)

    def getInfo(self):
        '''
        Get information about Historical Survey

        :return: see below
        '''
        return {
            "historicalSurveyId": self.historicalSurveyId,
            "userId": self.userId,
            "surveyId": self.surveyId,
            "response": self.response
        }

    @classmethod
    def getHistoricalSurveyIdsForUserId(cls, userId):
        '''
        Get list of survey Ids a User has responded to based on a userId

        Intended to contain duplicates

        :param userId: User's userId
        :return: List of survey's responded to
        '''
        # Historical Survey records for a User
        historicalSurveys = HistoricalSurvey.query.filter(userId=userId)

        # List of Survey Id's a user has responded to, (can and likely will contain duplicates)
        return [historicalSurvey.surveyId for historicalSurvey in historicalSurveys]

    @classmethod
    def createHistoricalSurvey(cls, userId, surveyId, response):
        '''
        Log a Survey response from a User

        :param userId: Id of responding User
        :param surveyId: Id of Survey being responded to
        :param response: int response code for Survey
        :return: Historical Survey response object
        '''
        # Create Historical Survey object
        historicalSurvey = HistoricalSurvey(userId=userId, surveyId=surveyId, response=response)

        # Save survey response to database
        db.session.add(historicalSurvey)
        db.session.commit()

        return historicalSurvey
    
    @classmethod
    def getAll(cls):
        '''
        Gets the HistoricalSurvey ids from the User table

        :return list of HistoricalSurvey ids
        '''
        # Get all Historical Surveys
        return [historicalSurvey.getInfo() for historicalSurvey in HistoricalSurvey.query.all()]
