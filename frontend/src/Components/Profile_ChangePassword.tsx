import React, { useContext, useState } from 'react'
import axios from 'axios'
import { Formik, Field, Form } from 'formik'
import { Container, FormGroup, Label, Input, Row, Button } from 'reactstrap'
import APIContext from '../Contexts/APIContext'

type ProfileChangePasswordProps = {
    backToMain: Function
}

const ProfileChangePassword = ({backToMain}: ProfileChangePasswordProps) => {
    const url = useContext(APIContext);
    const token = localStorage.getItem('access_token');

    const [passwordError, setPasswordError] = useState<String>("");
    
    const changePassword = async (data) => {
        if (data.oldPassword === "" || data.password === "" || data.confirmPassword === "") {
            setPasswordError("All fields are required!")
        }
        else if (data.password !== data.confirmPassword) {
            setPasswordError("Passwords don't match!")
        }
        else {
            await axios.post(url + 'auth/changePasswordWithAuth', {
                oldPassword: data.oldPassword,
                newPassword: data.confirmPassword
            },
                {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(response => {
                    console.log(response.data);
                    backToMain()
                    window.location.reload(false);
                })
                .catch(error => {
                    console.log(error);
                    setPasswordError("Old password is incorrect!")
                });
        }
    }
    
    return (
        <Container>
            <div>
                <h1 id="centered" style={{ fontWeight: 'bold' }}>Change Password</h1>
                <br />
            </div>
            <Formik initialValues={{ oldPassword: '', password: '', confirmPassword: '' }} onSubmit={data => changePassword(data)}>
                <Form>
                    <FormGroup>
                        <Label for='oldPassword'>Old Password</Label>
                        <Field name='oldPassword' type='password' placeholder='Old Password' as={Input} />
                    </FormGroup>
                    <FormGroup>
                        <Label for='password'>New Password</Label>
                        <Field name='password' type='password' placeholder='New Password' as={Input} />
                    </FormGroup>
                    <FormGroup>
                        <Label for='confirmPassword'>Confirm New Password</Label>
                        <Field name='confirmPassword' type='password' placeholder='New Password Confirm' as={Input} />
                    </FormGroup>
                    <div className='centered'>
                        <p className='error'>{passwordError}</p>
                    </div>
                    <Row className='centered'>
                        <div className="centered"><Button color="primary" size="md" type="submit" >Save Changes</Button></div>
                        &nbsp;&nbsp;
                        <div className="centered"><Button color="secondary" size="md" type="submit" onClick={() => backToMain()}>Cancel</Button></div>
                    </Row>
                </Form>
            </Formik>
        </Container>
    )
}

export default ProfileChangePassword;