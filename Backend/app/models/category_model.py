'''


@author Matthew Schofield
@version 9.21.2020
'''
# Library imports
from werkzeug.security import generate_password_hash, check_password_hash

# Module imports
from app import db

class Category(db.Model):
    '''
    Column definitions

    '''
    categoryId = db.Column(db.Integer(),  primary_key=True)
    categoryName = db.Column(db.String(128))

    survey = db.relationship('Task', backref="category", uselist=False)
