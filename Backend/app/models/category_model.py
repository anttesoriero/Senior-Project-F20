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
import sys

class Category(db.Model):
    '''
    Column definitions
    categoryId
    categoryName

    Relational Connections
    survey
    '''
    # Columns
    categoryId = db.Column(db.Integer(),  primary_key=True)
    categoryName = db.Column(db.String(128))

    # Set-up Relational connections
    task = db.relationship('Task', backref="category", uselist=False)

    def getName(self):
        return self.categoryName

    @classmethod
    def empty(cls):
        return Category.query.first() is None

    @classmethod
    def getByCategoryId(cls, categoryId):
        '''
        Get Category by categoryId

        :param categoryId: categoryId to get Category with
        :return: Category object connected to given categoryId
        '''
        category = Category.query.filter_by(
            categoryId=categoryId
        ).first()

        return category

