import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { FormGroup, Input, Label, Button, Spinner, Row, Col } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import axios from 'axios';

const Register = ({ history }: RouteComponentProps) => {
    const [submitting, setSubmitting] = useState(false);
    const [rerror, setRError] = useState(false);

    const signIn = data => {
        setSubmitting(true);
        axios.post('http://ec2-54-165-213-235.compute-1.amazonaws.com:80/auth/register', {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phone
        })
            .then(function (response) {
                setSubmitting(false);
                localStorage.setItem('access_token', response.data.access_token)
                history.push('/profile')
            })
            .catch(function (error) {
                setSubmitting(false);
                setRError(true);
                console.log(error);
            });
    }

    return (
        <Formik initialValues={{ email: '', password: '', firstName: '', lastName: '', phoneNumber: '' }} onSubmit={(data => signIn(data))}>
            {() => (
                <Form>
                    <FormGroup>
                        <Row>
                            <Col>
                                <Label className='drop' for="firstName">First Name</Label>
                                <Field placeholder='First Name' name='firstName' type='input' as={Input} />
                            </Col>
                            <Col>
                                <Label className='drop' for="firstName">Last Name</Label>
                                <Field placeholder='Last Name' name='lastName' type='input' as={Input} />
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Label className='drop' for="phone">Phone Number</Label>
                        <Field placeholder='Phone Number' name='phone' type='input' as={Input} />
                    </FormGroup>
                    <FormGroup>
                        <Label className='drop' for="email">Email*</Label>
                        <Field placeholder='Email' name='email' type='email' required as={Input} />
                    </FormGroup>
                    <FormGroup>
                        <Label className='drop' for="password">Password*</Label>
                        <Field placeholder='Password' name='password' type='password' required as={Input} />
                    </FormGroup>
                    <FormGroup>
                        <Label className='drop' for="passwordc">Confirm Password*</Label>
                        <Field placeholder='Confirm Password' name='passwordc' type='password' required as={Input} />
                    </FormGroup>
                    <p className='drop'>* are required fields</p>
                    <div className='centered'>
                        {rerror ? <p className='error'>There was an error making your account!</p> : <div></div>}
                    </div>
                    <FormGroup className='centered'>
                        {submitting ? <Button color='primary'><Spinner size='sm' />&nbsp;Making account...</Button> : <Button type='submit' color="primary">Create Account</Button>}
                    </FormGroup>
                </Form>
            )}
        </Formik>
    );
}

export default withRouter(Register);