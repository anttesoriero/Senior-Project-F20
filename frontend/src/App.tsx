import React from 'react';
import { Button, Container } from 'reactstrap';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import LandingPage from './Pages/LandingPage';
import ProfilePage from './Pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
          <Route exact={true} path="/" render={(props) => <LandingPage />}/>
          <Route exact={true} path="/profile" render={(props) => <ProfilePage />}/>
          {/* <Route exact={true} path="/shop" render={(props) => < Shop {...props}/>}/>
          <Route exact={true} path="/signin" render={(props) => < Signin {...props}/>}/>
          <Route exact={true} path="/register" render={(props) => < Register {...props}/>}/>
          <Route exact={true} path="/contact" render={(props) => < ContactPage {...props}/>}/> */}
          {/* <Redirect to="/"/> */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
