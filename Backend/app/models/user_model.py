'''
User's model for database

@author Matthew Schofield
@version 9.12.2020
'''
# Module imports
from app import db

# Models imports
from app.models.credentials_model import Credentials

class User(db.Model):
    '''
    Column definitions

    user_id Integer PK
    email   String  Unique
    name    String  Nullable
    '''
    # Column definitions
    user_id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(120), index=True, unique=True)
    name = db.Column(db.String(120), nullable=True)

    # Set-up Database Relationships
    credentials = db.relationship('Credentials', backref="user", uselist=False)

    def checkCredentials(self, password):
        '''
        Check if a plain text password matches the User's hashed password

        :param password: plain text password
        :return: Boolean whether password is the User's password
        '''
        return self.credentials.checkPassword(password)

    @classmethod
    def getByEmail(cls, email):
        '''
        Get User by email

        :param email: email to get User with
        :return: User object connected to given email
        '''
        user = User.query.filter_by(
            email=email
        ).first()

        return user

    @classmethod
    def getByUserId(cls, user_id):
        '''
        Get User by user_id

        :param user_id: user_id to get User with
        :return: User object connected to given user_id
        '''
        user = User.query.filter_by(
            user_id=user_id
        ).first()

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
    def createUser(cls, email, password, name=""):
        '''
        Creates a User

        :param email: User's email
        :param password: User's plaintext password
        :param name: name of the user
        '''
        # Check if user exists
        if not User.existsByEmail(email):
            return False

        # Create User
        user = User(email=email, name=name)
        Credentials.createCredentials(password=password, user=user)

        # Save User to database
        db.session.add(user)
        db.session.commit()
        return True
