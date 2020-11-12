'''
Survey's model for database
This stores static Surveys, a survey should never be removed or edited only disabled

@author Matthew Schofield, Jasdip Dhilllon
@version 11.11.2020
'''
# Module imports
from app import db

# Models imports

class Survey(db.Model):
    '''
    Column definitions
    surveyId | Integer | PK
    type     | String
    active   | String
    question | String
    answerA  | String
    answerB  | String
    answerC  | String | Nullable
    answerD  | String | Nullable
    answerE  | String | Nullable
    answerF  | String | Nullable
    '''
    # Column definitions
    surveyId = db.Column(db.Integer(),  primary_key=True)
    type = db.Column(db.String(120), nullable=False)
    active = db.Column(db.Boolean(), nullable=False)
    question = db.Column(db.String(120), nullable=False)
    answerA = db.Column(db.String(120), nullable=False)
    answerB = db.Column(db.String(120), nullable=False)
    answerC = db.Column(db.String(120), nullable=True)
    answerD = db.Column(db.String(120), nullable=True)
    answerE = db.Column(db.String(120), nullable=True)
    answerF = db.Column(db.String(120), nullable=True)

    def getPublicInfo(self):
        '''
        Get public information about a Survey

        :return: dictionary of Survey information
        '''
        output = {
            "surveyId": self.surveyId,
            "type": self.type,
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
        '''
        Check if the Survey table is empty

        :return: boolean whether the table is empty
        '''
        return Survey.query.first() is None

    @classmethod
    def createSurvey(cls, inputList):
        '''
        Creates a Survey

        :param inputList: survey represented as a list [type, question, answerA, answerB, ...]
        '''
        # Create Survey
        survey = Survey(
            active=True,
            type=inputList[0],
            question=inputList[1],
            answerA=inputList[2],
            answerB=inputList[3],
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

        :param surveyId: id of Survey to get
        :return: specific Survey
            or None
        '''
        survey = Survey.query.filter_by(
            surveyId=surveyId
        ).first()

        return survey

    @classmethod
    def getAll(cls):
        '''
        Gets the Survey ids from the Survey table

        :return list of survey ids
        '''

        return [survey.getPublicInfo() for survey in Survey.query.all()]
