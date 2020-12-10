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
                history.push('/adminUsers')
                console.log(response);
            })
            .catch(function (error) {
                setSubmitting(false);
                seetSerror(true);
                console.log(error);
            });
    }

    return (
        <div className='centered' style={{ display: 'flex', background: "linear-gradient(#2d5186, #1a3255)", height: '100vh' }}>
            <Container style={{ flex: '1 0 auto', alignItems: 'center', backgroundColor: '#3131314d', padding: '200px 0px 200px 0px'}}>

                <br />
                <Formik initialValues={{ password: '' }} onSubmit={(data => signIn(data))}>
                    {() => (
                        <Form >                
                            <div className='centered'>
                                <h2 style={{color: '#f3f3f3f3'}}>Please input admin password to proceed</h2>
                            </div>
                            <div className='centered'>
                                <FormGroup style={{width: '30vw'}} >
                                    <Field placeholder='Password' name='password' type='password' required as={Input} />
                                </FormGroup>

                            </div>
                            <div className='centered'>
                                {serror ? <p className='error'>Incorrect Password!</p> : <div></div>}
                            </div>
                            <FormGroup className='centered'>
                                {submitting ? <Button color='default'><Spinner size='sm' />&nbsp;Signing in...</Button> : <Button type='submit' color="default">Sign In</Button>}
                            </FormGroup>
                        </Form>
                    )}
                </Formik>
            </Container>
        </div>
    );
}

export default withRouter(AdminLogin);