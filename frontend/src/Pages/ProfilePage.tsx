import React, { useEffect, useState, useContext } from 'react';
import Navigation from '../Components/Navigation';
import { Container, Row, Col, Button, Media, Badge, FormGroup, Input, Label } from 'reactstrap';
import Footer from "../Components/Footer";
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import axios from 'axios';
import 'reactjs-popup/dist/index.css';
import { Formik, Form, Field } from 'formik';
import { TileLayer, MapContainer, Circle, Popup, Marker, Tooltip } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import APIContext from '../Contexts/APIContext';

type userState = {
    email: string,
    name: string,
    preferredName: string,
    accountBalance: number,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    phoneNumber: string,
    website: string,
    bio: string,
    profilePicture: string
}

const userInfo = {
    email: "",
    name: "",
    preferredName: "",
    accountBalance: 0,
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    website: "",
    bio: "",
    profilePicture: ""
}

const ProfilePage = () => {
    const url = useContext(APIContext);
    const token = localStorage.getItem('access_token');

    const [user, setUser] = useState<userState>(userInfo);
    const [passwordError, setPasswordError] = useState<String>("");
    const [pageState, setPageState] = useState<String>("main profile")

    const getUser = async () => {
        {/* Example of sending authorized request. Get can take multiple parameters, in this case 2.
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

    // Have to refactor this if using Formik for edit profile
    const editProfile = async (data) => {
        console.log('picture: ', userInfo.profilePicture)
        await axios.put(url + 'me/editInformation', {
            email: data.email,
            firstName: data.name.split(' ')[0],
            preferredName: data.preferredName,
            phoneNumber: data.phoneNumber,
            bio: data.bio,
            profilePicture: userInfo.profilePicture
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

    const backToMain = () => {
        setPageState("main profile")
    }

    const wantToEdit = () => {
        setPageState("edit profile")
    }

    const wantToChange = () => {
        setPageState("change password")
    }

    // User uploading a profile picture
    const handlePictureSelected = (event) => {
        var picture = event.target.files[0];
        var src     = URL.createObjectURL(picture);
      
        console.log('picture: ', picture)
        console.log('src: ', src)
        
        setUser({
            ...user,
            profilePicture: src
        })
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
                                                {user.profilePicture === "" ?                                                
                                                    <Media object src={PlaceholderImage} alt="Generic placeholder image" height="160" width="160" />
                                                :
                                                    // <img src={user.profilePicture}/>
                                                    <Media object src={user.profilePicture} alt="Generic placeholder image" height="160" width="160" />
                                                }        
                                            </Media>
                                            <Media body style={{ padding: 10 }}>
                                                {user ?
                                                    <div style={{ marginTop: '-3%' }}>
                                                        <h4>{user.name}</h4>
                                                        <h5>Goes by: 
                                                    {/* {user.preferredName} */}
                                                            {user.preferredName !== "" ? " " + user.preferredName : user.name.split(' ')[0]}
                                                        </h5>
                                                        <p>Rating: </p>
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
                                                {user ?
                                                    <Col xs="10"><p>{user.bio}</p></Col>
                                                    :
                                                    <Col xs="10"><p>User bio</p></Col>
                                                }

                                                <h4>Liked Jobs</h4>
                                                <p>Selected liked job categories from survey</p>

                                                <h4>Contact Info</h4>
                                                {/* Phone */}
                                                <Row>
                                                    <Col xs="2"><p>Phone:</p></Col>
                                                    {user ?
                                                        <Col xs="10"><p>{user.phoneNumber}</p></Col>
                                                        :
                                                        <Col xs="10"><p>5555555555</p></Col>
                                                    }  
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
                                                {/* <Row>
                                                    <Col xs="2"><p>Site:</p></Col>
                                                    {user.website ?
                                                        <Col xs="10"><p>{user.website}</p></Col>
                                                        :
                                                        <Col xs="10"><p>website.com</p></Col>
                                                    }
                                                </Row> */}
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

                                                        <MapContainer className="leaflet-container" center={[39.7089, -75.1183]} zoom={15.5} scrollWheelZoom={false} style={{ height: "200px" }} >
                                                            <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                                            {/* Map Circle Markers - MapsCircle */}
                                                            <Circle center={[39.7089, -75.1183]} pathOptions={{ color: 'blue', fillColor: 'blue' }} radius={150}>
                                                                <Tooltip sticky>Radius Users See</Tooltip>
                                                            </Circle>
                                                            <Marker position={[39.7089, -75.1183]}><Tooltip>Where You Are</Tooltip></Marker>
                                                        </MapContainer>
                                                    </div> : <div></div>}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Container>
                        )

                    case 'edit profile':
                        return (
                            <Container onSubmit={editProfile}>
                                <h1 id="centered" style={{ fontWeight: 'bold' }}>Edit Profile</h1>
                                <br />
                                <div className="centered">
                                    <Formik initialValues={{ email: user.email, name: user.name, preferredName: user.preferredName, phoneNumber: user.phoneNumber, profilePicture: user.profilePicture }} onSubmit={data => editProfile(data)}>
                                        <Form>
                                            {/* Row 1 - Change Name */}
                                            <Row>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="name"><h4>First Name</h4></Label>
                                                        <Field name='name' type='text' placeholder={user.name} as={Input} />
                                                    </FormGroup>
                                                </Col>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="preferredName"><h3>Preferred Name</h3></Label>
                                                        <Field name='preferredName' type='text' placeholder={user.preferredName} as={Input} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <hr />

                                            {/*Change email and preferred name */}
                                            <Row>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="email"><h4>Email Address</h4></Label>
                                                        <Field name='email' type='email' placeholder={user.email} as={Input} />
                                                    </FormGroup>
                                                </Col>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="phoneNumber"><h4>Phone Number</h4></Label>
                                                        <Field name='phoneNumber' type='text' placeholder={user.phoneNumber} as={Input} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <hr />

                                            <Row>
                                                <Col className="centered">
                                                    <FormGroup>
                                                        <Label for="bio"><h4>Bio</h4></Label>
                                                        <Field name='bio' type='textarea' placeholder={user.bio} as={Input} />
                                                    </FormGroup>                                                                                                       
                                                </Col>
                                            </Row>
                                            <hr />

                                            <Row>
                                                <Col className="centered">
                                                    <FormGroup>
                                                        <Label for="profilePicture"><h4>Profile Picture</h4></Label>
                                                        <br />
                                                        {user.profilePicture === '' ? 
                                                        <Media object src={PlaceholderImage} alt="Generic placeholder image" height="160" width="160" />
                                                        : 
                                                        <img src={user.profilePicture} style={{width: '12%', height: '12%'}} />
                                                        }
                                                        <br />
                                                        <Field name='profilePicture' type='file' onChange={handlePictureSelected} as={Input} />

                                                        {/* <input
                                                            type="file"
                                                            onChange={handlePictureSelected}
                                                        /> */}
                                                    
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
                                    </Formik>
                                </div>
                            </Container>
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