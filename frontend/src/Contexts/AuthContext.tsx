import React from 'react';

const token = localStorage.getItem('access_token');
var logginIn = false;

if(token !== null)
    logginIn = true;

export default React.createContext(logginIn);