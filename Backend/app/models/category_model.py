'''
Database model for Categories that are used to encapsulate jobs

@author Matthew Schofield
@version 11.11.2020
'''
# Module imports
from app import db

class Category(db.Model):
    '''
    Column definitions
    categoryId   Integer
    categoryName String

    Relational Connections
    task
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
        '''
        Check if there are Categories

        :return: boolean whether the table is empty
        '''
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

    @classmethod
    def getCategoryIDs(cls):
        '''
        Gets the category ids from the Category table

        :return list of category ids
        '''
        return [category.categoryId for category in Category.query.all()]
