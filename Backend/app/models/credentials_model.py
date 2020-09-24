'''
Credential's model for database
Connects to User table

@author Matthew Schofield
@version 9.12.2020
'''
# Library imports
from werkzeug.security import generate_password_hash, check_password_hash

# Module imports
from app import db

class Credentials(db.Model):
    '''
    Column definitions

    user_id
    password_hash
    '''
    userId = db.Column(db.Integer(), db.ForeignKey("user.userId"),  primary_key=True)
    passwordHash = db.Column(db.String(128))

    def checkPassword(self, password):
        '''
        Check if given plain text password matches hash in database

        :param password: plain text password
        :return: Boolean whether password hashes match
        '''
        return check_password_hash(self.passwordHash, password)

    @classmethod
    def createCredentials(cls, user, password):
        '''
        Create a Credentials object in the database

        :param user: User connected to
        :param password: plain text password for User
        '''
        # Hash password
        hashedPassword = generate_password_hash(password)

        # Create Credentials object
        credentials = Credentials(user=user, password_hash=hashedPassword)

        # Save to database
        db.session.add(credentials)
        db.session.commit()
