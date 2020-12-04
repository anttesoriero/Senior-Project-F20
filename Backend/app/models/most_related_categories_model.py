'''


@author Nicholas Romeo, Matthew Schofield
@version 11.06.2020
'''
# Library imports
from werkzeug.security import generate_password_hash, check_password_hash

# Module imports
from app import db

class MostRelatedCategories(db.Model):
    '''
    Column definitions

    '''

    mostRelatedCategoriesId = db.Column(db.Integer(), primary_key=True)
    categoryId = db.Column(db.Integer(), db.ForeignKey("category.categoryId"))
    MostRelatedCategoryIdA = db.Column(db.Integer(), nullable=True)
    MostRelatedCategoryIdB = db.Column(db.Integer(), nullable=True)
    MostRelatedCategoryIdC = db.Column(db.Integer(), nullable=True)

    

