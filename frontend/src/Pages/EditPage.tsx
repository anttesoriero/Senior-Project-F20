import React, { useEffect, useState, useContext } from 'react';
import Navigation from '../Components/Navigation';
import { Container, Row, Col, Button, Media, Form, FormGroup, Input, Label, CustomInput } from 'reactstrap';
import Footer from "../Components/Footer";
import StateSelector from "../Components/StateSelector";
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import 'reactjs-popup/dist/index.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import APIContext from '../Contexts/APIContext';

type editState = {
    email: string,
    firstName: string,
    lastName: string,
    preferredName: string,
    // Commented changing password, should probably be its own small screen
    // password: string,
    // confirmPass: string,
    accountBalance: number
}

const userInfo = {
    email: "",
    firstName: "",
    lastName: "",
    preferredName: "",
    // password: "",
    // confirmPass: "",
    accountBalance: 0
}


const EditPage = () => {
    const token = localStorage.getItem('access_token');
    const url = useContext(APIContext);

    const [user, setUser] = useState<editState>(userInfo);

    const getUser = async () => {
        {/* Example of sending authorized request. Get can take mulyiple parameters, in this case 2.
            First one is the endpoint and second is the authorization headers */}
        await axios.get(url + 'me/getProfile',
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
        await axios.put(url + 'me/editInformation', user,
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                console.log(response.data);
                // <Link to='/profile' />
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        getUser();
    }, []);

    const inputStyles = {
        maxWidth: 320,
    }

    {/* TO DO : */ }
    {/*const deleteAcc = window.confirm("Are you sure you want to delete your account?");*/ }

    return (
        <div>
            <Navigation />
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
                                    // onChange={e => setUser({...user, address: e.target.value})}
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
                                    // onChange={e => setUser({...user, phoneNumber: e.target.value})}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        {/* Row 4 - Change City, State, Zip */}
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="city"><h4>City</h4></Label>
                                    <Input type="text" name="city" id="city" placeholder="Glassboro" />
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
                                    <Input type="text" name="zip" id="zip" placeholder="08028" />
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
                                    <Input type="text" name="website" id="website" placeholder="wwww.usersite.com" />
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
                        <div className="centered"><Button color="primary" size="lg" type="submit" onSubmit={editProfile}>Save Changes</Button></div>

                    </Form>
                </div>
            </Container>
            <br />
            <Footer />
        </div>
    );
}

export default EditPage;