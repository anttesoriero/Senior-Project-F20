import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import {Container, Row, Col, Button, Media, Badge} from 'reactstrap';
import Footer from "../Components/Footer";
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import * as JWT from "jwt-decode";
import axios from 'axios';
// <script src="holder.js"/>

type userState = {
    email: string,
    firstName: string,
    lastName: string,
    accountBalance: number
}

const ProfilePage = () => {
    const token = localStorage.getItem('access_token');
    const [user, setUser]  = useState<userState>();

    const getUser = async () => {
        {/* Example of sending authorized request. Get can take mulyiple parameters, in this case 2.
            First one is the endpoint and second is the authorization headers */}
        await axios.get('http://127.0.0.1:5000/me/getProfile', 
        { headers: { Authorization: `Bearer ${token}` } })
        .then( response => {
            console.log(response.data);
            setUser(response.data)
        })
        .catch( error => {
            console.log(error);
        });   
    }
    
    useEffect(()=> {
        getUser();
    }, []);

    return (
        <div>
            <Navigation/>
            <Container>
                <h1 id="centered" style={{ fontWeight: 'bold' }}>Profile Page</h1>
                <br/>

                {/* Upper - Main user info and edit button */}
                <Row>
                    {/* Left - Prof Pic, name, and basic info */}
                    <Col xs="10">
                        <Media>
                            <Media left href="#">
                                <Media object src={PlaceholderImage} alt="Generic placeholder image" height="160" width="160"/>
                            </Media>
                            <Media body style={{padding: 10}}>
                                <Media heading>
                                    [FIRST NAME] [LAST NAME]
                                </Media>
                                    {user ? <p>Account balance ${String(user.accountBalance)}</p>  : <div></div>}
                            </Media>
                        </Media>
                    </Col>

                    {/* Right - Edit Profile button */}
                    <Col xs="2" id="right">
                        <Button outline color="primary" size="sm">Edit Profile</Button>{' '}
                    </Col>
                </Row>
                <br/>

                {/* Lower - Job History and About */}
                <Row>
                    {/* Left - Job History */}
                    <Col xs="4">
                        <h2 style={{ fontWeight: 'bold' }}>Job History</h2>
                        <hr/>

                        <div id="history_category">
                            <Media heading>Category 1 <Badge color="secondary">New</Badge></Media>
                            <br/>
                            <Row>
                                <Col xs="6" sm="4">
                                    <Media object src={PlaceholderImage} alt="Generic placeholder image" height="80" width="80"/>
                                </Col>
                                <Col xs="6" sm="4">
                                    <Media object src={PlaceholderImage} alt="Generic placeholder image" height="80" width="80"/>
                                </Col>
                                <Col sm="4">
                                    <Media object src={PlaceholderImage} alt="Generic placeholder image" height="80" width="80"/>
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
                        <hr/>

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
                            <Col xs="2"><p>Website:</p></Col>
                            <Col xs="10"><p>usersite.com</p></Col>
                        </Row>

                    </Col>
                </Row>
            </Container>
            <br />
            <Footer/>
        </div>
    );
}

export default ProfilePage;