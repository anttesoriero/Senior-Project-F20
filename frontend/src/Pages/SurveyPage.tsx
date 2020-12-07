import React, { Fragment, useEffect, useState, useContext } from 'react';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import { Container, Button, FormGroup, Input, Spinner, Label } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import APIContext from '../Contexts/APIContext';
import { RouteComponentProps, withRouter } from 'react-router-dom';

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

type user = {
  id: number
}

const SurveyPage = ({ history }: RouteComponentProps) => {
  const url = useContext(APIContext);
  const token = localStorage.getItem('access_token');

  const [user, setUser] = useState<user>();
  const [survey, setSurvey] = useState<surveyState>();
  const [serror, setSerror] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getSurvey = async () => {
    await axios.get(url + 'survey/recommendSurvey',
      { headers: { Authorization: `Bearer ${token}` } })
      .then(async response => {
        console.log(response.data.recommendedSurvey);
        setSurvey(response.data.recommendedSurvey);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const getUser = async () => {
    await axios.get(url + 'me/getProfile',
        { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
            console.log(response.data);
            setUser(response.data)
        })
        .catch(error => {
            console.log(error);
        });
  }

  const postSurvey = async (response) => {
    console.log(response.response)
    setSubmitting(true);
    await axios.post(url + 'survey/respond', {
      surveyId: survey?.surveyId,
      response: response.response
    },
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setSubmitting(false);
        console.log(response.data);
        setSuccess(true);
        var today = new Date();
        localStorage.setItem('daily_survey', today as unknown as string + user?.id as unknown as string);
        history.push('/profile')
      })
      .catch(error => {
        console.log(error);
        setSubmitting(false);
        setSerror(true);
      });
  }

  useEffect(() => {
    getSurvey();
    getUser();
  }, []);

  return (
    <Fragment>
      <Navigation />
      <Container>
        <h1 id="centered" style={{ fontWeight: 'bold' }}>Your Daily Survey</h1>
        <h3 id="centered">To Better Your Experience</h3>

        <hr />
        {survey ?
          <h4 style={{ fontWeight: 'bold' }} >{survey.question}</h4>
          :
          <p id="centered">Survey Question</p>
        }

        <Formik initialValues={{ response: '' }} onSubmit={(data => postSurvey(data))}>
          {() => (
            <Form >
              <FormGroup check>
                <Label check>
                  <Field name='response' type='radio' value={'A'} as={Input} />{survey?.answerA}
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Field name='response' type='radio' value={'B'} as={Input} />{survey?.answerB}
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Field name='response' type='radio' value={'C'} as={Input} />{survey?.answerC}
                </Label>
              </FormGroup>
              {survey?.answerD ?
                <FormGroup check>
                  <Label check>
                    <Field name='response' type='radio' value={'D'} as={Input} />{survey?.answerD}
                  </Label>
                </FormGroup> : <div></div>
              }
              {survey?.answerE ?
                <FormGroup check>
                  <Label check>
                    <Field name='response' type='radio' value={'E'} as={Input} />{survey?.answerE}
                  </Label>
                </FormGroup> : <div></div>
              }
              {survey?.answerF ?
                <FormGroup check>
                  <Label check>
                    <Field name='response' type='radio' value={'F'} as={Input} />{survey?.answerF}
                  </Label>
                </FormGroup> : <div></div>
              }
              <div className='centered'>
                {serror ? <p className='error'>There was an error submitting the survey!</p> : <div></div>}
              </div>
              <div className='centered'>
                {success ? <p style={{ fontWeight: 'bolder' }}>Thank you for completing the survey!</p> : <div></div>}
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

export default withRouter(SurveyPage);