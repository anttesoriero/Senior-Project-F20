'''
User's model for database

@author Matthew Schofield
@version 9.12.2020
'''
# Module imports
from app import db

# Models imports
from app.models.credentials_model import Credentials
from app.models.account_balance_model import AccountBalance
from app.models.offer_model import Offer
from app.models.category_model import Category
from app.models.task_model import Task
from app.models.extended_user_model import ExtendedUser
from app.models.survey_model import Survey
from app.models.historical_survey_model import HistoricalSurvey

class User(db.Model):
    '''
    Column definitions

    userId        Integer  PK
    email         String   Unique
    firstName     String   Nullable
    lastName      String   Nullable
    preferredName String   Nullable
    phoneNumber   String   Nullable
    '''
    # Column definitions
    userId = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(120), index=True, unique=True)
    firstName = db.Column(db.String(120), nullable=True)
    lastName = db.Column(db.String(120), nullable=True)
    preferredName = db.Column(db.String(120), nullable=True)
    phoneNumber = db.Column(db.String(12), nullable=True)

    # Set-up Database Relationships
    credentials = db.relationship('Credentials', backref="user", uselist=False)
    accountBalance = db.relationship('AccountBalance', backref="user", uselist=False)
    postedTasks = db.relationship('Task', backref="user", uselist=True)
    extendedModel = db.relationship('ExtendedUser', backref="user", uselist=False)
    historicalSurvey = db.relationship('HistoricalSurvey', backref="user", uselist=True)


    def setFirstName(self, newName):
        self.firstName = newName
        db.session.commit()

    def setEmail(self, newEmail):
        self.email = newEmail
        db.session.commit()

    def checkCredentials(self, password):
        '''
        Check if a plain text password matches the User's hashed password

        :param password: plain text password
        :return: Boolean whether password is the User's password
        '''
        return self.credentials.checkPassword(password)

    def getTaskIds(self):
        return [task.taskId for task in self.postedTasks]

    '''
    Interactions with credentials are routed through Credentials object
    '''
    def setPassword(self, password):
        self.credentials.changePassword(password=password)

    '''
    Interactions with account balance are routed through Account Balance object
    '''
    def getAccountBalance(self):
        return self.accountBalance.getBalance()

    def changeAccountBalance(self, amountToChange):
        return self.accountBalance.changeBalance(amountToChange)

    def getBriefPublicInfo(self):
        '''
        Get a brief overview of information about a user
        :return:
        '''
        output = {
            "name": self.firstName + ' ' + self.lastName,
            "preferredName": self.preferredName,
            "phoneNumber": self.phoneNumber,
            "email": self.email
        }
        return output

    def getPublicInfo(self):
        '''
        Get a more in-depth overview of information about a user
        :return:
        '''

        output = {
            "name": self.firstName + ' ' + self.lastName,
            "preferredName": self.preferredName,
            "phoneNumber": self.phoneNumber,
            "email": self.email,
            "gender": self.extendedModel.gender
        }
        return output

    @classmethod
    def getByEmail(cls, email):
        '''
        Get User by email

        :param email: email to get User with
        :return: User object connected to given email
        '''
        # User or None
        user = User.query.filter_by(
            email=email
        ).first()
        return user

    @classmethod
    def getByUserId(cls, userId):
        '''
        Get User by user_id

        :param user_id: user_id to get User with
        :return: User object connected to given user_id
        '''
        user = User.query.filter_by(
            userId=userId
        ).first()
        if user.extendedModel.gender is None:
            user.extendedModel.gender = ''
        return user

    @classmethod
    def existsByEmail(cls, email):
        '''
        Check if a given User exists by email

        :param email: email to check for User existance
        :return: Boolean whether User exists
        '''
        return not User.getByEmail(email)

    @classmethod
    def createUser(cls, email, password, firstName=""):
        '''
        Creates a User

        :param email: User's email
        :param password: User's plaintext password
        :param name: name of the user
        '''
        # Check if user exists
        if not User.existsByEmail(email):
            return None

        # Create User
        user = User(email=email, firstName=firstName)
        Credentials.createCredentials(password=password, user=user)
        AccountBalance.createBalance(user=user, accountBalance=10.0)

        # Save User to database
        db.session.add(user)
        db.session.commit()
        return user
