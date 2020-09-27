'''
Database model for Categories that are used to encapsulate jobs

Things here are specific categories of jobs
Mowing the lawn
Picking up groceries
Move furniture

@author Matthew Schofield
@version 9.25.2020
'''
# Module imports
from app import db

class Category(db.Model):
    '''
    Column definitions
    categoryId
    categoryName
    categoryType

    Relational Connections
    survey
    '''
    categoryId = db.Column(db.Integer(),  primary_key=True)
    categoryName = db.Column(db.String(128))
    # Enumerations for type of job
    categoryType = db.Column(db.String(128))

    # Set-up Relational connections
    survey = db.relationship('Task', backref="category", uselist=False)
