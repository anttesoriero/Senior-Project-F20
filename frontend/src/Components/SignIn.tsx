import React, {useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { FormGroup, Input, Label, Button, Spinner } from 'reactstrap';
import {RouteComponentProps, withRouter } from 'react-router-dom';
import axios from 'axios';

const SignIn = ({history}: RouteComponentProps) => {
    const [submitting, setSubmitting] = useState(false);
    const [serror, seetSerror] = useState(false);

    const signIn = data => {
        setSubmitting(true);
        axios.post('http://127.0.0.1:5000/auth/login', {
            email: data.email,
            password: data.password
          })
          .then(function (response) {
            setSubmitting(false);
            localStorage.setItem('access_token', response.data.access_token);
            history.push('/profile')
            console.log(response);
          })
          .catch(function (error) {
            setSubmitting(false);
            seetSerror(true);
            console.log(error);
          });   
    }

    return (
        <Formik initialValues={{ email: '', password: ''}} onSubmit={(data => signIn(data))}>
        {() => (
            <Form >
                <FormGroup>
                    <Label className='drop' for="email">Email</Label>
                    <Field placeholder='Email' name='email' type='email' required as={Input}/>
                </FormGroup>
                <FormGroup>
                    <Label className='drop' for="password">Password</Label>
                    <Field placeholder='Password' name='password' type='password' required as={Input}/>
                </FormGroup>
                <div className='centered'>
                    {serror ? <p className='error'>Incorrect Credentials!</p> : <div></div>}
                </div>
                <FormGroup className='centered'>
                    {submitting ? <Button color='primary'><Spinner size='sm'/>&nbsp;Signing in...</Button>: <Button type='submit' color="primary">Sign In</Button>}
                </FormGroup>
            </Form>
        )}
    </Formik>
    );
}

export default withRouter(SignIn);