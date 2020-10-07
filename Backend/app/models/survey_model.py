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
    '''
    # Column definitions
    surveyId = db.Column(db.Integer(),  primary_key=True)
    active = db.Column(db.Boolean(), nullable=False)
    question = db.Column(db.String(120), nullable=False)
    answerA = db.Column(db.String(120), nullable=False)
    answerB = db.Column(db.String(120), nullable=True)
    answerC = db.Column(db.String(120), nullable=True)
    answerD = db.Column(db.String(120), nullable=True)
    answerE = db.Column(db.String(120), nullable=True)

    # Set-up Database Relationships
    @classmethod
    def createSurvey(cls, inputList):
        '''
        Creates a Survey

        '''
        # Create Survey
        survey = Survey(
            active=True,
            question=inputList[0],
            answerA=inputList[1],
            answerB=inputList[2] if 2 < len(inputList) else None,
            answerC=inputList[3] if 3 < len(inputList) else None,
            answerD=inputList[4] if 4 < len(inputList) else None,
            answerE=inputList[5] if 5 < len(inputList) else None
        )

        # Save User to database
        db.session.add(survey)
        db.session.commit()
        return survey
