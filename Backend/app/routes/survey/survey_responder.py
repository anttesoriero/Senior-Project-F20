from app.models.historical_survey_model import HistoricalSurvey
from app.models.survey_model import Survey

class SurveyResponseHandler:

    def __init__(self):
        self.survey_handles = {
            1: self.gender_set,
            2: self.age_set,
            9: self.poster_pref_set,
            10: self.overall_sat,
            11: self.simplicity_sat,
            12: self.visual_sat,
            15: self.reliability_sat,
            16: self.trust_sat
        }
        self.survey_mapper = {}
        self.build_survey_map()

    def respond(self, current_user, survey_id, response):
        HistoricalSurvey.createHistoricalSurvey(current_user.userId, survey_id, response)
        self.survey_handles.get(survey_id, self.catch)(current_user, response)

    def catch(self, current_user, response):
        pass

    def build_survey_map(self):
        for survey in Survey.getAll():
            self.survey_mapper[survey["surveyId"]] = survey
        self.survey_mapper[9] = {
            "answerA": 1,
            "answerB": -1,
            "answerC": 0
        }

    '''
    Maps input character to a Rating
    [A, F] => [5, 0]

    :param character: character to map
    :return: mapped integer
    '''
    def charToRating(self, in_str):
        return 5 - (ord(in_str[0]) - 65)

    '''
    1 - Set Gender 
    '''
    def gender_set(self, current_user, response):
        current_user.extendedModel.setGender(self.survey_mapper[1].get("answer"+response, None))

    '''
    2 - Set Age 
    '''
    def age_set(self, current_user, response):
        current_user.extendedModel.setAge(self.survey_mapper[2].get("answer"+response, None))

    '''
    9 - Change Poster Pref 
    '''
    def poster_pref_set(self, current_user, response):
        current_user.extendedModel.setPosterPreference(self.survey_mapper[9].get("answer"+response, None))

    '''
    10 - Overall Satisfaction
    '''
    def overall_sat(self, current_user, response):
        rating = self.charToRating(response)
        current_user.extendedModel.setOverallSatisfaction(rating)

    '''
    11 - Simplicity Satisfaction
    '''
    def simplicity_sat(self, current_user, response):
        rating = self.charToRating(response)
        current_user.extendedModel.setSimplicitySatisfaction(rating)

    '''
    12 - Visual Satisfaction
    '''
    def visual_sat(self, current_user, response):
        rating = self.charToRating(response)
        current_user.extendedModel.setVisualSatisfaction(rating)

    '''
    15 - Reliability Satisfaction
    '''
    def reliability_sat(self, current_user, response):
        rating = self.charToRating(response)
        current_user.extendedModel.setReliabilitySatisfaction(rating)

    '''
    16 - Trust Satisfaction
    '''
    def trust_sat(self, current_user, response):
        rating = self.charToRating(response)
        current_user.extendedModel.setTrustSatisfaction(rating)


survey_response_handler = SurveyResponseHandler()