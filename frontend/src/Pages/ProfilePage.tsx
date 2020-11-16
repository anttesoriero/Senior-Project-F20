import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import { Container, Row, Col, Button, Media, Badge, FormGroup, Input, Label } from 'reactstrap';
import Footer from "../Components/Footer";
import StateSelector from "../Components/StateSelector";
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import axios from 'axios';
import 'reactjs-popup/dist/index.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';

type userState = {
    email: string,
    firstName: string,
    lastName: string,
    preferredName: string,
    accountBalance: number,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    phoneNumber: string,
    website: string,
    bio: string
}

const userInfo = {
    email: "",
    firstName: "",
    lastName: "",
    preferredName: "",
    accountBalance: 0,
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    website: "",
    bio: ""
}

const ProfilePage = () => {
    const token = localStorage.getItem('access_token');
    const [user, setUser] = useState<userState>(userInfo);
    const [passwordError, setPasswordError] = useState<String>("");
    const [pageState, setPageState] = useState<String>("main profile")

    const getUser = async () => {
        {/* Example of sending authorized request. Get can take multiple parameters, in this case 2.
            First one is the endpoint and second is the authorization headers */}
        await axios.get('http://ec2-54-165-213-235.compute-1.amazonaws.com:80/me/getProfile',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
                setUser(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Have to refactor this if using Formik for edit profile
    const editProfile = async (data) => {
        await axios.put('http://ec2-54-165-213-235.compute-1.amazonaws.com:80//me/editInformation', data,
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
            });
    }

    const changePassword = async (data) => {
        if (data.oldPassword === "" || data.password === "" || data.confirmPassword === "") {
            setPasswordError("All fields are required!")
        }
        else if (data.password !== data.confirmPassword) {
            setPasswordError("Passwords don't match!")
        }
        else {
            await axios.post('http://ec2-54-165-213-235.compute-1.amazonaws.com:80/auth/changePasswordWithAuth', {
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

    const backToMain = () => {
        setPageState("main profile")
    }

    const wantToEdit = () => {
        setPageState("edit profile")
    }

    const wantToChange = () => {
        setPageState("change password")
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div>
            <Navigation />

            {(() => {
                switch (pageState) {
                case 'main profile':
                    return (
                    <Container>
                        <h1 id="centered" style={{ fontWeight: 'bold' }}>Profile Page</h1>
                        <br />

                        {/* Upper - Main user info and edit button */}
                        <Row>
                            {/* Left - Prof Pic, name, and basic info */}
                            <Col xs="10">
                                <Media>
                                    <Media left href="#">
                                        <Media object src={PlaceholderImage} alt="Generic placeholder image" height="160" width="160" />
                                    </Media>
                                    <Media body style={{ padding: 10 }}>
                                        {user ?
                                            <div>
                                                <p>Goes by: {user.preferredName}</p>
                                                <p>Account Balance: ${String(user.accountBalance)}</p>
                                            </div>
                                            :
                                            <div>
                                                Account Balance: $[__]
                                                    {/*{' '}<Button outline color="info" size="sm">Cash Out</Button>{' '}*/}
                                            </div>}
                                    </Media>
                                </Media>
                            </Col>

                            {/* Right - Edit Profile button */}
                            <Col xs="2" id="right">
                                <Button onClick={wantToEdit} outline color="primary" size="sm">Edit Profile</Button>{' '}
                                &nbsp;&nbsp;
                                <Button onClick={wantToChange} outline color="primary" size="sm">Change Password</Button>{' '}
                            </Col>
                        </Row>
                        <br />

                        {/* Lower - Job History and About */}
                        <Row>
                            {/* Left - Job History */}
                            <Col xs="4">
                                <h2 style={{ fontWeight: 'bold' }}>Job History</h2>
                                <hr />

                                <div id="history_category">
                                    <Media heading>Category 1 <Badge color="secondary">New</Badge></Media>
                                    <br />
                                    <Row>
                                        <Col xs="6" sm="4">
                                            <Media object src={PlaceholderImage} alt="Generic placeholder image" height="80" width="80" />
                                        </Col>
                                        <Col xs="6" sm="4">
                                            <Media object src={PlaceholderImage} alt="Generic placeholder image" height="80" width="80" />
                                        </Col>
                                        <Col sm="4">
                                            <Media object src={PlaceholderImage} alt="Generic placeholder image" height="80" width="80" />
                                        </Col>
                                    </Row>
                                    {/*
                                    <Media>
                                        <Media left object id="smallMedia" data-src="holder.js/80x80" alt="Generic placeholder image" />
                                        <Media center object id="smallMedia" data-src="holder.js/80x80" alt="Generic placeholder image" />
                                        <Media right object id="smallMedia" data-src="holder.js/80x80" alt="Generic placeholder image" />
                                    </Media>
                                    */}
                                </div>
                            </Col>

                            {/* Right - About */}
                            <Col xs="8">
                                <h2 style={{ fontWeight: 'bold' }}>About</h2>
                                <hr />
                                <Row>
                                    {/* Left - About Info */}
                                    <Col xs="6">
                                        <h4>Bio</h4>
                                        <p>General bio for profile owner</p>

                                        <h4>Liked Jobs</h4>
                                        <p>Selected liked job categories from survey</p>

                                        <h4>Contact Info</h4>
                                        {/* Phone */}
                                        <Row>
                                            <Col xs="2"><p>Phone:</p></Col>
                                            <Col xs="10"><p>(555) 555-5555</p></Col>
                                        </Row>
                                        {/* Email */}
                                        <Row>
                                            <Col xs="2"><p>Email:</p></Col>
                                            {user ?
                                                <Col xs="10"><p>{user.email}</p></Col>
                                                :
                                                <Col xs="10"><p>user@email.com</p></Col>
                                            }
                                        </Row>
                                        {/* Website */}
                                        <Row>
                                            <Col xs="2"><p>Site:</p></Col>
                                            {user.website ?
                                                <Col xs="10"><p>{user.website}</p></Col>
                                                :
                                                <Col xs="10"><p>user@website.com</p></Col>
                                            }
                                        </Row>
                                    </Col>
                                    {/* Right - Location */}
                                    <Col xs="6">
                                        {user ?
                                            <div>
                                                <h4>Address</h4>
                                                {user.address ?
                                                    <p>{user.address}, {user.city}, {user.state} {user.zipCode}</p>
                                                    :
                                                    <p>123 Main St, City, ST 12345</p>
                                                }
                                                <Media left>
                                                    <Media object src={PlaceholderImage} alt="Generic placeholder image" height="200" width="200" />
                                                    <p>Google Map Location</p>
                                                </Media>
                                            </div> : <div></div>}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                    )

                case 'edit profile':
                    return (
                        <div></div>
                    )          

                case 'change password':
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
                                    <div className="centered"><Button color="secondary" size="md" type="submit" onClick={backToMain}>Cancel</Button></div>
                                </Row>
                            </Form>
                        </Formik>
                    </Container>
                    )

                default:
                    return null;
                }
            })()}
            <br />
            <Footer />
        </div >
    );
}

export default ProfilePage;