import React, { Fragment, useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import {Container, Row, Col, Button} from 'reactstrap';
import axios from 'axios';

type surveyState = {
  active: boolean;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  answerE: string;
  answerF: string;
  question: string;
  surveyId: number
}

type surveyIDState = {
  id: number;
}

const SurveyPage = () => {
  const token = localStorage.getItem('access_token');
  const [survey, setSurvey]  = useState<surveyState>();

  const getSurvey = async () => {
    await axios.get('http://127.0.0.1:5000/survey/recommendSurvey', 
    { headers: { Authorization: `Bearer ${token}` } })
    .then( async response => {
        console.log(response);
          await axios.get(`http://127.0.0.1:5000/survey/getSurvey?surveyId=${response.data.recommendedSurvey}`, 
          { headers: { Authorization: `Bearer ${token}` } })
          .then( response => {
              console.log(response);
              setSurvey(response.data)
          })
          .catch( error => {
              console.log(error);
          });   
    })
    .catch( error => {
        console.log(error);
    });
  }


  useEffect(()=> {
    getSurvey();
  }, []);

    return (
     <Fragment>
     <div>
      <Navigation/>
      <Container>
        <h1 id="centered" style={{ fontWeight: 'bold' }}>Survey Page</h1>
        <br/>

        <h2 id="centered">Here's your daily survey</h2>
        <p id="centered">This survey helps us make your experience better!</p>
        <hr/>
      <Row>
        {survey ?
           <h4 id="centered" style={{ fontWeight: 'bold' }} >{survey.question}</h4>
           :
           <p id="centered">Some more information if needed</p>
         }
      </Row>
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
                     </label>
                     {survey ?
                     <p>{survey.answerA}</p>
                     :
                     <div></div>
                    }
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
                    </label>
                    {survey ?
                     <p>{survey.answerB}</p>
                     :
                     <p></p>
                    }
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
                      </label>
                      {survey ?
                     <p>{survey.answerC}</p>
                     :
                     <div></div>
                    }
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
                      </label>
                      {survey ?
                     <p>{survey.answerD}</p>
                     :
                     <div></div>
                    }
                    </div>

                    {survey ? 
                      <div className="form-check">
                          <label>
                            <input
                            type="radio"
                            name="choice"
                            value="option5"
                            checked={true}
                            className="form-check-input"
                          />
                          </label>
                        <p>{survey.answerE}</p>
                      </div>
                      : <div></div>
                    }

                    {survey ? 
                      <div className="form-check">
                          <label>
                            <input
                            type="radio"
                            name="choice"
                            value="option5"
                            checked={true}
                            className="form-check-input"
                          />
                          </label>
                        <p>{survey.answerF}</p>
                      </div>
                      : <div></div>
                    }

                  <Row>
                    <Col><hr/></Col>
                    <Col id="centered"><Button href="javascript:history.go(-1)" color="secondary">Previous</Button></Col>
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
  </Fragment>
  );
}

export default SurveyPage;