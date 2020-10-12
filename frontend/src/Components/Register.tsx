import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { FormGroup, Input, Label, Button, Spinner } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import axios from 'axios';

const Register = ({ history }: RouteComponentProps) => {
    const [submitting, setSubmitting] = useState(false);

    const signIn = data => {
        setSubmitting(true);
        axios.post('https://futurfits-api.herokuapp.com/api/v1/user/register', {
            email: data.email,
            password: data.password
        })
            .then(function (response) {
                setSubmitting(false);
                console.log(response);
                history.push('/profile')
            })
            .catch(function (error) {
                setSubmitting(false);
                console.log(data);
            });
    }

    return (
        <Formik initialValues={{ email: '', password: '' }} onSubmit={(data => signIn(data))}>
            {() => (
                <Form >
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Field placeholder='Email' name='email' type='email' required as={Input} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Field placeholder='Password' name='password' type='password' required as={Input} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Confirm Password</Label>
                        <Field placeholder='Confirm Password' name='password' type='password' required as={Input} />
                    </FormGroup>
                    <FormGroup className='centered'>
                        {submitting ? <Button color='primary'><Spinner size='sm' />&nbsp;Making account...</Button> : <Button type='submit' color="primary">Create Account</Button>}
                    </FormGroup>
                </Form>
            )}
        </Formik>
    );
}

export default withRouter(Register);