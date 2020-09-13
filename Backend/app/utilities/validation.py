def validateRequestJSON(request, requiredParamaters, variableParameters):
    '''
    Validates an input request as JSON with the given required parameters

    :param request:
    :param requiredParamaters:
    :return:
    '''
    formattedJSON = {
        "_formatSuccess": True,
        "_status": "good format",
    }

    # Validate input is JSON
    if not request.is_json:
        formattedJSON["_formatSuccess"] = False
        formattedJSON["_status"] = "request not json"
        return formattedJSON

    # Check for missing parameters
    for param in requiredParamaters:
        parameter = request.json.get(param, None)
        if not parameter:
            if formattedJSON["_formatSuccess"]:
                formattedJSON["_status"] = "Missing parameters: "
            formattedJSON["_status"] += parameter
            formattedJSON["_formatSuccess"] = False
        else:
            formattedJSON[param] = parameter

    # Add in variable parameters
    for param in variableParameters:
        formattedJSON[param] = request.json.get(param, None)

    return formattedJSON
