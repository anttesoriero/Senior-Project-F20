import React, { useContext, useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { FormGroup, Input, Label, Button, Spinner } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc'
import axios from 'axios';
import APIContext from '../Contexts/APIContext';

const SignIn = ({ history }: RouteComponentProps) => {
    const url = useContext(APIContext);
    const [didDailySurvey, setDidDailySurvey] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [serror, seetSerror] = useState(false);

    useEffect(() => {
        checkDaily()
    }, [])

    const checkDaily = () => {
        const storage = localStorage.getItem('daily_survey')
        var timestamp = storage?.substring(0, 15)
        console.log(timestamp)
        let hoy = new Date();
        localStorage.setItem('today', hoy as unknown as string)
        var today = localStorage.getItem('today')?.substring(0, 15)
        console.log(today)
        if (timestamp === today)
            setDidDailySurvey(true)
        else return;
    }

    function openInNewTab(path) {
        var win = window.open(path, '_blank');
        win?.focus();
      }

    const oauth = () => {
        axios.get(url + 'auth/oauth')
            .then(function (response) {
                setSubmitting(false);
                //localStorage.setItem('access_token', response.data.access_token);
                //history.push('/profile')
                console.log(response);
                openInNewTab(response.data)
            })
            .catch(function (error) {
                setSubmitting(false);
                seetSerror(true);
                console.log(error);
            });
    }

    const signIn = data => {
        setSubmitting(true);
        axios.post(url + 'auth/login', {
            email: data.email,
            password: data.password
        })
            .then(function (response) {
                setSubmitting(false);
                localStorage.setItem('access_token', response.data.access_token);
                didDailySurvey ? history.push('/profile') : history.push('/survey')
                console.log(response);
            })
            .catch(function (error) {
                setSubmitting(false);
                seetSerror(true);
                console.log(error);
            });
    }

    return (
        <Formik initialValues={{ email: '', password: '' }} onSubmit={(data => signIn(data))}>
            {() => (
                <Form >
                    <FormGroup>
                        <Label className='drop' for="email">Email</Label>
                        <Field placeholder='Email' name='email' type='email' required as={Input} />
                    </FormGroup>
                    <FormGroup>
                        <Label className='drop' for="password">Password</Label>
                        <Field placeholder='Password' name='password' type='password' required as={Input} />
                    </FormGroup>
                    <div className='centered'>
                        {serror ? <p className='error'>Incorrect Credentials!</p> : <div></div>}
                    </div>
                    <FormGroup className='centered'>
                        {submitting ? <Button color='primary'><Spinner size='sm' />&nbsp;Signing in...</Button> : <Button type='submit' color="primary">Sign In</Button>}&nbsp;
                        <Button type='button' onClick={oauth} style={{ color: '#333', backgroundColor: '#fff', border: 'none' }}><FcGoogle /> Sign In</Button>
                    </FormGroup>
                </Form>
            )}
        </Formik>
    );
}

export default withRouter(SignIn);