'''
Survey's model for database

This stores static Surveys, a survey should never be removed or edited only disabled

@author Matthew Schofield
@version 9.25.2020
'''
# Module imports
from app import db

# Models imports

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
    answerF
    '''
    # Column definitions
    type = db.Column(db.String(120), nullable=False)
    surveyId = db.Column(db.Integer(),  primary_key=True)
    active = db.Column(db.Boolean(), nullable=False)
    question = db.Column(db.String(120), nullable=False)
    answerA = db.Column(db.String(120), nullable=False)
    answerB = db.Column(db.String(120), nullable=True)
    answerC = db.Column(db.String(120), nullable=True)
    answerD = db.Column(db.String(120), nullable=True)
    answerE = db.Column(db.String(120), nullable=True)
    answerF = db.Column(db.String(120), nullable=True)

    def getPublicInfo(self):
        output = {
            "surveyId": self.surveyId,
            "active": self.active,
            "question": self.question,
            "answerA": self.answerA,
            "answerB": self.answerB,
            "answerC": self.answerC,
            "answerD": self.answerD,
            "answerE": self.answerE,
            "answerF": self.answerF
        }
        return output
    
    @classmethod
    def empty(cls):
        return Survey.query.first() is None

    # Set-up Database Relationships
    @classmethod
    def createSurvey(cls, inputList):
        '''
        Creates a Survey

        '''
        # Create Survey
        survey = Survey(
            active=True,
            type=inputList[0],
            question=inputList[1],
            answerA=inputList[2],
            answerB=inputList[3] if 3 < len(inputList) else "",
            answerC=inputList[4] if 4 < len(inputList) else "",
            answerD=inputList[5] if 5 < len(inputList) else "",
            answerE=inputList[6] if 6 < len(inputList) else "",
            answerF=inputList[7] if 7 < len(inputList) else ""
        )

        # Save User to database
        db.session.add(survey)
        db.session.commit()
        return survey

    @classmethod
    def getBySurveyId(cls, surveyId):
        '''
        Get a survey based on Id

        :param surveyId: survey to get
        :return: specific survey
            or None
        '''
        survey = Survey.query.filter_by(
            surveyId=surveyId
        ).first()

        return survey

    @classmethod
    def recommendSurvey(cls):
        surveys = Survey.query
        surveys = [survey.surveyId for survey in surveys]
        return surveys
    
    @classmethod
    def getSurveyIDs(cls):
        '''
        Gets the survey ids from the User table
        :return list of survey ids
        '''

        surveys = db.session.query(Survey)
        survey_ids = []

        for survey in surveys:
            # add survey ids to list
            survey_ids.append(survey.surveyId)

        return survey_ids
