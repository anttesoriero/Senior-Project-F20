from app.models.extended_user_model import ExtendedUser
from app.models.survey_model import Survey
from app.models.historical_survey_model import HistoricalSurvey

'''
Recommend surveys

:author: Matthew Schofield
:version: 12.14.2020
'''
class SurveyRecommender:

     def __init__(self):
         pass

     def recommend(self, user):
        '''
        Recommend a Survey for a User

        :return: recommended survey Id
        '''
        # Get both lists to compare
        survey_ids = Survey.getSurveyIds()
        completed_survey_ids = HistoricalSurvey.getHistoricalSurveyIdsForUserId(user.userId)
        availableSurveyIds = {}

        for survey_id in survey_ids:
            availableSurveyIds[survey_id] = completed_survey_ids.count(survey_id)

        # Prioritize surveys for most/least interested categories
        if availableSurveyIds[26] == 0:
            recommendedSurvey = 26
        elif availableSurveyIds[27] == 0:
            recommendedSurvey = 27
        else:
            recommendedSurvey = min(availableSurveyIds.keys(), key=(lambda k: availableSurveyIds[k]))

        return recommendedSurvey

survey_recommender = SurveyRecommender()