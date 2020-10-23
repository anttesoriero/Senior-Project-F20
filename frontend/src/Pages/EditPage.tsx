import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import {Container, Row, Col, Button, Media, Badge} from 'reactstrap';
import Footer from "../Components/Footer";
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import axios from 'axios';
// <script src="holder.js"/>

type editState = {
    email: string,
    firstName: string,
    lastName: string,
    accountBalance: number
}

const EditPage = () => {
    const token = localStorage.getItem('access_token');
    const [profile, editUser]  = useState<editState>();

    const getProfile = async () => {
        {/* Example of sending authorized request. Get can take mulyiple parameters, in this case 2.
            First one is the endpoint and second is the authorization headers */}
        await axios.get('http://127.0.0.1:5000/me/getProfile', 
        { headers: { Authorization: `Bearer ${token}` } })
        .then( response => {
            console.log(response.data);
            editUser(response.data)
        })
        .catch( error => {
            console.log(error);
        });   
    }
    
    useEffect(()=> {
        getProfile();
    }, []);

    return (
        <div>
            <Navigation/>
            <Container>
                <h1 id="centered" style={{ fontWeight: 'bold' }}>Edit Profile Page</h1>
                <br/>

                <Row>
                    {/* Left - Prof Pic, name, and basic info */}
                    <Col xs="10">
                        <Media>
                            <Media left href="#">
                                <Media object src={PlaceholderImage} alt="Generic placeholder image" height="160" width="160"/>
                            </Media>
                            <Media body style={{padding: 10}}>
                                    {profile ?
                                        <Media heading>{profile.firstName} {profile.lastName}</Media>
                                        :
                                        <Media heading>[FIRST NAME] [LAST NAME]</Media>
                                    }
                            </Media>
                        </Media>
                    </Col>

                    <Button outline color="primary" size="sm">Edit Picture</Button>{' '}
                    <Button outline color="primary" size="sm">Change Name</Button>{' '}
                    <Button outline color="primary" size="sm">Change Password</Button>{' '}
                    
                    </Row>
            </Container>
            <br />
            <Footer/>
        </div>
    );
}
    export default EditPage;