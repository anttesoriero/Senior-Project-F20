from app.models.extended_user_model import ExtendedUser
from app.models.survey_model import Survey
from app.models.historical_survey_model import HistoricalSurvey
from app.models.task_model import Task

class TaskRecommender:

     def __init__(self):
         pass

     def recommend(self, user):
        '''
        Recommend Task filters for a User

        :return: recommended task filters
        '''
        # Init filters
        filters = {}

        filters["location"] = {"within": []}

        eum = user.extendedModel

        if not eum.locationInterestedInALatitude is None and not eum.locationInterestedInALongitude is None:
            latA = float(eum.locationInterestedInALongitude)
            lonA = float(eum.locationInterestedInALatitude)
            if latA is not None and lonA is not None:
                filters["location"]["within"] = [
                        lonA-1,
                        lonA+1,
                        latA-1,
                        latA+1
                    ]

        tasks = [task.getPublicInfo() for task in Task.search(filters, 10)]
        return {"query": filters, "tasks": tasks}

task_recommender = TaskRecommender()