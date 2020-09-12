'''
User's model for database

@author Matthew Schofield
@version 9.12.2020
'''
# Library imports
from werkzeug.security import generate_password_hash, check_password_hash

# Module imports
from app import db

class User(db.Model):
    '''
    Column definitions

    id
    email
    password_hash
    '''
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        '''
        Hash and set a new password

        :param password: new password to use
        '''
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        '''
        Check if a given password is valid

        :param password: password to check
        :return: Boolean True/False on validity
        '''
        return check_password_hash(self.password_hash, password)
