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

       <h2 id="centered">Here's your daily survey</h2>
       <p id="centered">This survey helps us make your experience better!</p>
       <hr/>

       <h4 id="centered" style={{ fontWeight: 'bold' }} >[Example Question ... ?]</h4>
       <p id="centered">Some more information if needed</p>

       <div className="container">
          <div className="row mt-5">
            <div className="col-sm-12">

              <form>

                <div className="form-check">
                  <label>
                    <input
                    type="radio"
                    name="choice"
                    value="option1"
                    checked={true}
                    className="form-check-input"
                  />
                  Example Choice #1
                  </label>
                </div>

                <div className="form-check">
                  <label>
                    <input
                    type="radio"
                    name="choice"
                    value="option2"
                    checked={true}
                    className="form-check-input"
                  />
                  Example Choice #2
                  </label>
                </div>

                <div className="form-check">
                  <label>
                    <input
                    type="radio"
                    name="choice"
                    value="option3"
                    checked={true}
                    className="form-check-input"
                  />
                  Example Choice #3
                  </label>
                </div>

                <div className="form-check">
                  <label>
                    <input
                    type="radio"
                    name="choice"
                    value="option4"
                    checked={true}
                    className="form-check-input"
                  />
                  Example Choice #4
                  </label>
                </div>

                <div className="form-check">
                  <label>
                    <input
                    type="radio"
                    name="choice"
                    value="option5"
                    checked={true}
                    className="form-check-input"
                  />
                  Example Choice #5
                  </label>
                </div>

                <Row>
                    <Col><hr/></Col>
                    <Col id="centered"><Button href="/survey" color="secondary">Previous</Button></Col>
                    <Col id="centered"><Button href="/survey" color="primary">Next</Button></Col>
                    <Col><hr/></Col>
                </Row>
                <h4> </h4>

      </form>

    </div>
  </div>
</div>

    </Container>
    <Footer/>
   </div>
  );
}

export default SurveyPage;