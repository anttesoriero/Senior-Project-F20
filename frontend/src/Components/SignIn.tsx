import React, { useContext, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { FormGroup, Input, Label, Button, Spinner } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import axios from 'axios';
import APIContext from '../Contexts/APIContext';
import GoogleLogin from 'react-google-login';

const SignIn = ({ history }: RouteComponentProps) => {
    const url = useContext(APIContext);

    const [submitting, setSubmitting] = useState(false);
    const [serror, setSerror] = useState(false);
    const [oauthError, setOAuthError] = useState(false);

    const oauth = (response) => {
        const { email, familyName, givenName, googleId, imageUrl } = response.profileObj
        setSubmitting(true);
        axios.post(url + 'auth/oauth', {
            email: email,
            password: googleId,
            firstName: givenName,
            lastName: familyName,
            profilePicture: imageUrl
        })
            .then(function (response) {
                setSubmitting(false);
                localStorage.setItem('access_token', response.data.access_token)
                history.push('/profile')
            })
            .catch(function (error) {
                setSubmitting(false);
                setOAuthError(true);
                console.log(error);
            });
    }

    const oauthErrorResponse = () => {
        setOAuthError(true)
    }

    const signIn = async (data) => {
        setSubmitting(true);
        axios.post(url + 'auth/login', {
            email: data.email,
            password: data.password
        })
            .then(async function(response){
                setSubmitting(false);
                localStorage.setItem('access_token', response.data.access_token);
                const storage = localStorage.getItem('daily_survey')
                const token = localStorage.getItem('access_token')
                const  user =  await axios.get(url + 'me/getProfile', { headers: { Authorization: `Bearer ${token}` }})
                var timestamp = storage?.substring(0, 15) + '' + storage?.substring(storage.length - 1)
                console.log(timestamp)
                let hoy = new Date();
                localStorage.setItem('today', hoy as unknown as string)
                var today = localStorage.getItem('today')?.substring(0, 15) + '' + user.data.id as unknown as string
                timestamp === today ? history.push('/profile') : history.push('/survey')
            })
            .catch(function (error) {
                setSubmitting(false);
                setSerror(true);
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
                    <div className='centered'>
                        {oauthError ? <p className='error'>Error with that Google Account!</p> : <div></div>}
                    </div>
                    <FormGroup className='centered'>
                        {submitting ? <Button color='primary'><Spinner size='sm' />&nbsp;Signing in...</Button> : <Button type='submit' color="primary">Sign In</Button>}&nbsp;
                        <GoogleLogin
                            clientId="984254031044-31ou2h0ce0hve56ccggp303b1g1rtnfg.apps.googleusercontent.com"
                            buttonText="Login"
                            onSuccess={oauth}
                            onFailure={oauthErrorResponse}
                            cookiePolicy={'single_host_origin'}
                            // isSignedIn={true}
                        />
                    </FormGroup>
                </Form>
            )}
        </Formik>
    );
}

export default withRouter(SignIn);