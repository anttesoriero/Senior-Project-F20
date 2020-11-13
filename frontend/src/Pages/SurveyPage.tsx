import React, { Fragment, useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import { Container, Row, Col, Button, FormGroup, Input, Spinner, Label } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
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

const SurveyPage = () => {
  const token = localStorage.getItem('access_token');
  const [survey, setSurvey] = useState<surveyState>();
  const [serror, setSerror] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getSurvey = async () => {
    await axios.get('http://ec2-54-165-213-235.compute-1.amazonaws.com:80/survey/recommendSurvey',
      { headers: { Authorization: `Bearer ${token}` } })
      .then(async response => {
        console.log(response);
        await axios.get(`http://ec2-54-165-213-235.compute-1.amazonaws.com:80/survey/getSurvey?surveyId=${response.data.recommendedSurvey}`,
          { headers: { Authorization: `Bearer ${token}` } })
          .then(response => {
            console.log(response);
            setSurvey(response.data)
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }

  const postSurvey = async (response) => {
    setSubmitting(true);
    console.log(response)
    await axios.post('http://ec2-54-165-213-235.compute-1.amazonaws.com:80/survey/respond', {
      surveyId: survey?.surveyId,
      answer: response
    },
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setSubmitting(false);
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
        setSubmitting(false);
        setSerror(true);
      });
  }

  useEffect(() => {
    getSurvey();
  }, []);

  return (
    <Fragment>
      {/* <Navigation /> */}
      <Container>
        <h1 id="centered" style={{ fontWeight: 'bold' }}>Survey Page</h1>
        <br />

        <h2 id="centered">Here's your daily survey</h2>
        <p id="centered">These surveys help make your experience better!</p>
        <hr />
        <Row>
          {survey ?
            <h4 id="centered" style={{ fontWeight: 'bold' }} >{survey.question}</h4>
            :
            <p id="centered">Some more information if needed</p>
          }
        </Row>

        <Formik initialValues={{ response: '' }} onSubmit={(data => postSurvey(data))}>
          {() => (
            <Form >
              <FormGroup check>
                <Label check>
                  <Field name='response' type='radio' value={'a'} as={Input} />{survey?.answerA}
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Field name='response' type='radio' value={'b'} as={Input} />{survey?.answerB}
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Field name='response' type='radio' value={'c'} as={Input} />{survey?.answerC}
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Field name='response' type='radio' value={'d'} as={Input} />{survey?.answerD}
                </Label>
              </FormGroup>
              {survey?.answerE ?               
                <FormGroup check>
                  <Label check>
                    <Field name='response' type='radio' value={'e'} as={Input} />{survey?.answerE}
                  </Label>
                </FormGroup>: <div></div>
              }
              {survey?.answerF ?               
                <FormGroup check>
                  <Label check>
                    <Field name='response' type='radio' value={'f'} as={Input} />{survey?.answerF}
                  </Label>
                </FormGroup>: <div></div>
              }
              <div className='centered'>
                {serror ? <p className='error'>There was an error submitting the survey?</p> : <div></div>}
              </div>
              <FormGroup className='centered'>
                {submitting ? <Button color='primary'><Spinner size='sm' />&nbsp;Submitting...</Button> : <Button type='submit' color="primary">Submit</Button>}&nbsp;
                    </FormGroup>
            </Form>
          )}
        </Formik>
      </Container>
      <Footer />
    </Fragment>
  );
}

export default SurveyPage;