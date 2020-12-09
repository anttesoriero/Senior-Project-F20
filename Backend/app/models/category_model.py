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
    categoryId        Integer
    categoryName      String
    recommendedHourly Integer

    Relational Connections
    task
    '''
    # Columns
    categoryId = db.Column(db.Integer(),  primary_key=True)
    categoryName = db.Column(db.String(128))
    recommendedHourly = db.Column(db.Integer())
    mostRelatedCategoryIdA = db.Column(db.Integer(), nullable=True)
    mostRelatedCategoryIdB = db.Column(db.Integer(), nullable=True)
    mostRelatedCategoryIdC = db.Column(db.Integer(), nullable=True)

    # Set-up Relational connections
    task = db.relationship('Task', backref="category", uselist=False)

    def getName(self):
        '''
        Get name of category

        :return: Name of category
        '''
        return self.categoryName

    def getInfo(self):
        '''
        Get information about a category

        :return: Serializable output summary of category object
        '''
        # Get most related categories
        mostRelatedA = None
        mostRelatedB = None
        mostRelatedC = None
        if self.mostRelatedCategoryIdA is not None:
            mostRelatedA = Category.getByCategoryId(self.mostRelatedCategoryIdA).getName()

        if self.mostRelatedCategoryIdB is not None:
            mostRelatedB = Category.getByCategoryId(self.mostRelatedCategoryIdB).getName()

        if self.mostRelatedCategoryIdC is not None:
            mostRelatedC = Category.getByCategoryId(self.mostRelatedCategoryIdC).getName()

        # Return information about category
        return {
            "categoryId": self.categoryId,
            "categoryName": self.categoryName,
            "recommendedHourly": self.recommendedHourly,
            "mostRelatedA": mostRelatedA,
            "mostRelatedB": mostRelatedB,
            "mostRelatedC": mostRelatedC
        }

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
