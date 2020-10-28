import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import {Container, Row, Col, Button, Media} from 'reactstrap';
import Footer from "../Components/Footer";
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import 'reactjs-popup/dist/index.css';
import axios from 'axios';


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
    
    {/* TO DO : */}
    {/*const deleteAcc = window.confirm("Are you sure you want to delete your account?");*/}

    return (
        <div>
            <Navigation/>
            <Container>
                <h1 id="centered" style={{ fontWeight: 'bold' }}>Edit Profile</h1>
                <br/>

                <Row>
                    {/* Left - Prof Pic, name, and basic info */}
                    <Col xs="9">
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
                                    
                                    {profile ?
                                        <p>Account Balance: ${String(profile.accountBalance)}</p>
                                        :
                                        <div>
                                            Account Balance: $[__]
                                            {/*{' '}<Button outline color="info" size="sm">Cash Out</Button>{' '}*/}
                                        </div>}
                                        <br/>
                                        <h6 id="centered"> Edit Your Profile Information Below </h6> 
                                        <hr/>         
                            </Media>
                        </Media>
                    </Col>
                    </Row>
                    
                    {/*Upper buttons*/}
                    <div>
                    <Row>
                    <Col xs="8">
                        <h3 id="centered" style={{ fontWeight: 'bold' }}>Profile Information</h3>
                        <hr/>  
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputFileAddon">
                                Edit Picture
                                </span>
                            </div>
                            <div className="custom-file">
                             <input
                                type="file"
                                className="custom-file-input"
                                id="inputFile"
                                aria-describedby="inputGroupFileAddon"
                            />
                            <label color="primary" className="custom-file-label" htmlFor="inputFileAddon">
                                Choose new image from file browser
                            </label>
                        </div>
                    </div>
                            <hr/>
                            <Button id="centered" color="primary" size="sm">Edit Name</Button>{' '}
                            <hr/>
                            <Button id="centered" color="primary" size="sm">Update Location</Button>{' '}
                            <hr/>
                            <Button id="centered" color="primary" size="sm">Edit Contact Information</Button>{' '}
                            <hr/>
                            <Button id="centered" color="primary" size="sm">Change Password</Button>{' '}  
                        </Col>
                    </Row>      
                    
                    {/*Bottom hand buttons*/}
                    <Row>
                        <Col xs="8">
                             <h3 id="centered" style={{ fontWeight: 'bold' }}>Manage Funds</h3>
                             <hr/>
                            <Button id="centered" outline color="warning" size="sm">Deposit Funds</Button>{' '}
                            <hr/>
                            <Button id="centered" outline color="primary" size="sm">Withdraw Funds</Button>{' '}
                        </Col>
                    </Row>

                    {/*Account deletion*/}
                    <Row>
                        <Col xs="8">
                            <h3 id="centered" style={{ fontWeight: 'bold' }}>Delete Account</h3>
                            <hr/>
                            <Button id="centered" color="secondary" size="sm">Delete Account</Button>{/*deleteAcc*/}
                        </Col>
                    </Row>    
                </div>
            </Container>
            <br/>
            <Footer/>
        </div>
    );
}

    export default EditPage;