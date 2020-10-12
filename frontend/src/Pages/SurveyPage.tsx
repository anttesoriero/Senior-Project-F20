import React from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import {Container, Row, Col, Button, Media, Badge} from 'reactstrap';

const SurveyPage = () => {
  return (
  <div>
        <Navigation/>
        <Container>
        <h1 id="centered" style={{ fontWeight: 'bold' }}>Survey Page</h1>
        <br/>


      </Container>
      <Footer/>
   </div>
  );
}

export default SurveyPage;