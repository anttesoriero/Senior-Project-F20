import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import { Container, Row, Col, Button, Media, Badge, Form, FormGroup, Input, Label } from 'reactstrap';
import Footer from "../Components/Footer";
import StateSelector from "../Components/StateSelector";
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import axios from 'axios';
import 'reactjs-popup/dist/index.css';
import { transpileModule } from 'typescript';
// <script src="holder.js"/>

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
    const [editing, setEditing] = useState<boolean>(false);

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

    const editProfile = async () => {
        await axios.put('http://ec2-54-165-213-235.compute-1.amazonaws.com:80/me/editInformation', user,
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const wantToEdit = () => {
        setEditing(!editing)
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div>
            <Navigation />
            {/* Conditional rendering of profile page vs. editing page */}
            {!editing ?
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
                                        <Media heading>{user.firstName} {user.lastName}</Media>
                                        :
                                        <Media heading>[FIRST NAME] [LAST NAME]</Media>
                                    }

                                    {user ?
                                        <p>Account Balance: ${String(user.accountBalance)}</p>
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

                : // Editing page stuff below

                <Container onSubmit={editProfile}>
                    <h1 id="centered" style={{ fontWeight: 'bold' }}>Edit Profile</h1>
                    <br />

                    <Row>
                        {/* Left - Prof Pic, name, and basic info */}
                        <Col xs="9">
                            <Media>
                                <Media left href="#">
                                    <Media object src={PlaceholderImage} alt="Generic placeholder image" height="160" width="160" />
                                </Media>
                                <Media body style={{ padding: 10 }}>
                                    {user ?
                                        <Media heading>{user.firstName} {user.lastName}</Media>
                                        :
                                        <Media heading>[FIRST NAME] [LAST NAME]</Media>
                                    }

                                    {user ?
                                        <p>Account Balance: ${String(user.accountBalance)}</p>
                                        :
                                        <div>
                                            Account Balance: $[__]
                                            {/*{' '}<Button outline color="info" size="sm">Cash Out</Button>{' '}*/}
                                        </div>}
                                    <br />
                                    <br />
                                </Media>
                            </Media>
                        </Col>
                    </Row>

                    {/*Edit picture*/}
                    <div>
                        <Row>
                            <Col xs="8">
                                <div className="centered"></div>
                                <hr />
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
                            </Col>
                        </Row>
                    </div>

                    <div className="centered">
                        <Form>
                            {/* Row 1 - Change Name */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="firstName"><h4>First Name</h4></Label>
                                        <Input
                                            type="text"
                                            name="firstName"
                                            id="firstName"
                                            value={user?.firstName}
                                            onChange={e => setUser({ ...user, firstName: e.target.value })}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="lastName"><h4>Last Name</h4></Label>
                                        <Input
                                            type="text"
                                            name="lastName"
                                            id="lastName"
                                            value={user?.lastName}
                                            onChange={e => setUser({ ...user, lastName: e.target.value })}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <hr />

                            {/*Row 2 - Change Password */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="password"><h4>New Password</h4></Label>
                                        <Input type="text" name="password" id="password" placeholder="" />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="lastName"><h4>Confirm Password</h4></Label>
                                        <Input type="text" name="confirmPass" id="confirmPass" placeholder="" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <hr />

                            {/* Row 3 - Change Address & Phone Number */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="address"><h4>Address</h4></Label>
                                        <Input
                                            type="text"
                                            name="address"
                                            id="address"
                                            placeholder="123 Main St"
                                            value={user.address}
                                            onChange={e => setUser({ ...user, address: e.target.value })}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="number"><h4>Phone Number</h4></Label>
                                        <Input
                                            type="text"
                                            name="number"
                                            id="number"
                                            placeholder="(555)-555-5555"
                                            value={user.phoneNumber}
                                            onChange={e => setUser({ ...user, phoneNumber: e.target.value })}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            {/* Row 4 - Change City, State, Zip */}
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="city"><h4>City</h4></Label>
                                        <Input
                                            type="text"
                                            name="city"
                                            id="city"
                                            placeholder="City"
                                            value={user.city}
                                            onChange={e => setUser({ ...user, city: e.target.value })}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="state"><h4>State</h4></Label>
                                        <StateSelector />
                                    </FormGroup>
                                </Col>
                                <Col md="2">
                                    <FormGroup>
                                        <Label for="zip"><h4>Zip</h4></Label>
                                        <Input
                                            type="text"
                                            name="zip"
                                            id="zip"
                                            placeholder="Zip Code"
                                            value={user.zipCode}
                                            onChange={e => setUser({ ...user, zipCode: e.target.value })}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            {/* Row 5 - Change email and website */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="email"><h4>Email Address</h4></Label>
                                        <Input
                                            type="text"
                                            name="email"
                                            id="email"
                                            // placeholder="joesmith@email.com"
                                            value={user?.email}
                                            onChange={e => setUser({ ...user, email: e.target.value })}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="website"><h4>User Website</h4></Label>
                                        <Input
                                            type="text"
                                            name="website"
                                            id="website"
                                            placeholder="user@website.com"
                                            value={user.website}
                                            onChange={e => setUser({ ...user, website: e.target.value })}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            {/*Manage funds buttons*/}
                            <Row>
                                <Col xs="8">
                                    <h3 id="centered" style={{ fontWeight: 'bold' }}>Manage Funds</h3>
                                    <hr />
                                    <Button id="centered" outline color="warning" size="sm">Deposit Funds</Button>{' '}
                                    <br />
                                    <Button id="centered" outline color="primary" size="sm">Withdraw Funds</Button>{' '}
                                </Col>
                            </Row>

                            {/*Account deletion*/}
                            <Row>
                                <Col xs="8">
                                    <h3 id="centered" style={{ fontWeight: 'bold' }}>Delete Account</h3>
                                    <hr />
                                    <Button id="centered" color="secondary" size="sm">Delete Account</Button>{/*deleteAcc*/}
                                </Col>
                            </Row>

                            <br />
                            <br />
                            <Row className='centered'>
                                <div className="centered"><Button color="primary" size="md" type="submit" onSubmit={editProfile}>Save Changes</Button></div>
                                &nbsp;&nbsp;
                                <div className="centered"><Button color="secondary" size="md" type="submit" onClick={wantToEdit}>Cancel</Button></div>
                            </Row>
                        </Form>
                    </div>
                </Container>
            }
            <br />
            <Footer />
        </div>
    );
}

export default ProfilePage;