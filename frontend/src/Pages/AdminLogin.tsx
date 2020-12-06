import React, { useState, useEffect, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import { FormGroup, Button, Spinner, Input } from 'reactstrap';
import axios from 'axios';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Container } from 'reactstrap';
import APIContext from '../Contexts/APIContext';

const AdminLogin = ({ history }: RouteComponentProps) => {
    const url = useContext(APIContext);

    const [submitting, setSubmitting] = useState(false);
    const [serror, seetSerror] = useState(false);

    const checkAuth = () => {
        const auth = sessionStorage.getItem('admin_pass')
        if (auth) history.push('/adminDash')
    }
    useEffect(() => {
        checkAuth();
    }, [])

    const signIn = data => {
        setSubmitting(true);
        axios.post(url + 'admin/getAllUsers', {
            adminPassword: data.password
        })
            .then(function (response) {
                setSubmitting(false);
                sessionStorage.setItem('admin_pass', data.password);
                history.push('/adminDash')
                console.log(response);
            })
            .catch(function (error) {
                setSubmitting(false);
                seetSerror(true);
                console.log(error);
            });
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Container style={{ flex: '1 0 auto' }}>
                <h2>Please input admin password to proceed</h2>
                <br />
                <Formik initialValues={{ password: '' }} onSubmit={(data => signIn(data))}>
                    {() => (
                        <Form >
                            <FormGroup>
                                <Field placeholder='Password' name='password' type='password' required as={Input} />
                            </FormGroup>
                            <div className='centered'>
                                {serror ? <p className='error'>Incorrect Password!</p> : <div></div>}
                            </div>
                            <FormGroup className='centered'>
                                {submitting ? <Button color='primary'><Spinner size='sm' />&nbsp;Signing in...</Button> : <Button type='submit' color="primary">Sign In</Button>}
                            </FormGroup>
                        </Form>
                    )}
                </Formik>
            </Container>
        </div>
    );
}

export default withRouter(AdminLogin);