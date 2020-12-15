def validateRequestJSON(request, requiredParamaters, variableParameters):
    '''
    Validates an input request as JSON with the given required parameters

    :param request: flask request object
    :param requiredParamaters: list of required parameters
    :param variableParameters: list of non-required parameters
    '''
    success = True
    errorCode = 400
    goodCode = 200

    # This is useful to drop unexpected parameters
    # This is useful to drop unexpected parameters
    outputJSON = {}

    # Validate input is JSON
    if not request.is_json:
        success = False
        return success, errorCode, {}

    # Check for missing parameters
    for paramName in requiredParamaters:
        parameter = request.json.get(paramName, None)
        if parameter is None:
            success = False
            return success, errorCode, {}
        outputJSON[paramName] = parameter

    # Add in variable parameters
    for paramName in variableParameters:
        outputJSON[paramName] = request.json.get(paramName, None)

    return success, goodCode, outputJSON

