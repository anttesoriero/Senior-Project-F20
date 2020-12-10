import React, { useEffect, useState, useContext } from 'react';
import Navigation from '../Components/Navigation';
import { Container, Row, Col, Button, Media, FormGroup, Input, Label, PopoverBody, UncontrolledPopover } from 'reactstrap';
import Footer from "../Components/Footer";
import axios from 'axios';
import 'reactjs-popup/dist/index.css';
import { Formik, Form, Field } from 'formik';
import { TileLayer, MapContainer, Circle, Marker, Tooltip } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import APIContext from '../Contexts/APIContext';
import StateSelector from '../Components/StateSelector';
import PostTasksCarousel from './../Components/PostedTasksCarousel';
import TasksCompletedCarousel from './../Components/TasksCompletedCarousel';

type userState = {
    email: string,
    name: string,
    preferredName: string,
    accountBalance: number,
    phoneNumber: string,
    bio: string,
    profilePicture: string,
    address: string,
    posterRating: number | null,
    workerRating: number | null,
    mostInterestedCategory: string,
    leastInterestedCategory: string
}

const userInfo = {
    email: "",
    name: "",
    preferredName: "",
    accountBalance: 0,
    phoneNumber: "",
    bio: "",
    profilePicture: "",
    address: "",
    posterRating: null,
    workerRating: null,
    mostInterestedCategory: "",
    leastInterestedCategory: ""
}

const ProfilePage = () => {
    const url = useContext(APIContext);
    const token = localStorage.getItem('access_token');

    const [user, setUser] = useState<userState>(userInfo);
    const [pastTasks, setPastTasks] = useState();
    const [initials, setInitials] = useState<String>("");
    // const [userLatLong, setUserLatLong] = useState<userLatLong>();
    const [passwordError, setPasswordError] = useState<String>("");
    const [pageState, setPageState] = useState<String>("main profile");

    const getUser = async () => {
        {/* Example of sending authorized request. Get can take multiple parameters, in this case 2.
            First one is the endpoint and second is the authorization headers */}
        await axios.get(url + 'me/getProfile',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
                const firstName = response.data.name.split(' ')[0]
                const lastName = response.data.name.split(' ')[1]
                const initials = firstName.charAt(0) + lastName.charAt(0)
                setUser(response.data)
                setInitials(initials)
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Have to refactor this if using Formik for edit profile
    const editProfile = async (data) => {
        const geoAddress = data.address + data.city + data.state + data.zip
        const address = data.address + ', ' + data.city + ', ' + data.state + ', ' + data.zip

        // geocode(geoAddress)
        
        const userInfo = {
            email: data.email,
            firstName: data.name.split(' ')[0],
            lastName: data.name.split(' ')[1],
            preferredName: data.preferredName,
            phoneNumber: data.phoneNumber,
            bio: data.bio,
        }

        if (data.address !== '') {
            userInfo['address'] = address
        }

        await axios.put(url + 'me/editInformation', userInfo,
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                backToMain()
                window.location.reload(false);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const deleteAccount = async () => {
        await axios.delete(url + 'me/deleteAccount',
        { headers: { Authorization: `Bearer ${token}`} })
        .then(response => {
            console.log(response.data);
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

    // const geocode = async (data) => {
    //     if (data === undefined) {
    //         setUserLatLong({
    //             latitude: 0,
    //             longitude: 0
    //         })
    //         return
    //     }
    //     // var location = data.address + data.city + data.state + data.zip;
    //     await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    //         params: {
    //             address: data,
    //             key: 'AIzaSyAqavh6zA4RtzZud6DohqzFjdJscxQ_Hk4'
    //         }
    //     })
    //     .then(function(response){		
	// 		const results = response.data.results
	// 		if (results !== undefined && results.length !== 0) {
	// 			const { lat, lng } = results[0].geometry.location
             
	// 			setUserLatLong({
    //                 latitude: lat,
    //                 longitude: lng
    //             })
    //         }
	// 		else {
	// 			throw "That address doesn't exist!"
	// 		}
    //     })
    // } 

    // const computeUserRating = () => {
    //     const { workerRating, posterRating } = userInfo
    //     if (workerRating === null && posterRating === null) {
    //         return 'No Ratings Yet'
    //     }
    //     if (workerRating === null) {
    //         return `${posterRating}`
    //     }
    //     if (posterRating === null) {
    //         return `${workerRating}`
    //     }
    //     const averageRating = (workerRating! + posterRating!) / 2
    //     return `${averageRating}`
    // }

    const backToMain = () => {
        setPageState("main profile")
    }

    const wantToEdit = () => {
        setPageState("edit profile")
    }

    const wantToChange = () => {
        setPageState("change password")
    }

    let formatPhoneNumber = (str) => {
        //Filter only numbers from the input
        let cleaned = ('' + str).replace(/\D/g, '');

        //Check if the input is of correct length
        let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        };

        return null
    };

    useEffect(() => {
        getUser();
    }, []);

    const isMobile = window.innerWidth < 1000;

    return (
        <div>
            <Navigation />

            {(() => {
                switch (pageState) {
                    case 'main profile':
                        return (
                            <Container>
                                <h1 id="centered" style={{ fontWeight: 'bold' }}>Profile</h1>
                                <br />

                                {/* Upper - Main user info and edit button */}
                                {isMobile ?
                                    <div> {/* MOBILE */}
                                        {/* User Info */}
                                        <Media>
                                            <Media left href="#">
                                                {user.profilePicture === "" ?                                                
                                                    // <Media object src={PlaceholderImage} alt="Generic placeholder image" height="160" width="160" />
                                                    <Button 
                                                        disabled 
                                                        style={{borderRadius: 10, fontSize: 60, marginTop: '10%', paddingLeft: 30, paddingRight: 30, height: 160, width: 160}}>
                                                        {initials}
                                                    </Button>
                                                :
                                                    // <img src={user.profilePicture}/>
                                                    <Media object src={user.profilePicture} alt="Generic placeholder image" height="160" width="160" />
                                                }        
                                            </Media>
                                            <Media body style={{ padding: 10 }}>
                                                <div style={{ marginTop: '-3%', marginLeft: '3%' }}>
                                                    <h4>{user.name}</h4>
                                                    <h5>Goes by: 
                                                        {user.preferredName ? " " + user.preferredName : ' ' + user.name.split(' ')[0]}
                                                    </h5>

                                                    <p>Poster Rating: {user.posterRating === null ? 'No Ratings Yet' : user.posterRating}</p>
                                                    <p>Worker Rating: {user.workerRating === null ? 'No Ratings Yet' : user.workerRating}</p>
                                                    <p>Account Balance: ${String(user.accountBalance)}</p>
                                                </div>
                                            </Media>
                                        </Media>
                                        <br />
                                        
                                        {/* Buttons */}
                                        <Button onClick={wantToEdit} outline color="primary" size="sm">Edit Profile</Button>{' '}
                                        &nbsp;&nbsp;
                                        <Button onClick={wantToChange} outline color="primary" size="sm">Change Password</Button>{' '}
                                    </div>
                                :
                                    <Row> {/* NORMAL */}
                                        {/* Left - Prof Pic, name, and basic info */}
                                        <Col xs="10">
                                            <Media>
                                                <Media left href="#">
                                                    {user.profilePicture === "" ?                                                
                                                        // <Media object src={PlaceholderImage} alt="Generic placeholder image" height="160" width="160" />
                                                        <Button 
                                                            disabled 
                                                            style={{borderRadius: 10, fontSize: 60, marginTop: '10%', paddingLeft: 30, paddingRight: 30, height: 160, width: 160}}>
                                                            {initials}
                                                        </Button>
                                                    :
                                                        // <img src={user.profilePicture}/>
                                                        <Media object src={user.profilePicture} alt="Generic placeholder image" height="160" width="160" />
                                                    }        
                                                </Media>
                                                <Media body style={{ padding: 10 }}>
                                                    <div style={{ marginTop: '-3%', marginLeft: '3%' }}>
                                                        <h4>{user.name}</h4>
                                                        <h5>Goes by: 
                                                            {user.preferredName ? " " + user.preferredName : ' ' + user.name.split(' ')[0]}
                                                        </h5>

                                                        <p>Poster Rating: {user.posterRating === null ? 'No Ratings Yet' : user.posterRating}</p>
                                                        <p>Worker Rating: {user.workerRating === null ? 'No Ratings Yet' : user.workerRating}</p>
                                                        <p>Account Balance: ${String(user.accountBalance)}</p>
                                                    </div>
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
                                }  

                                <br />

                                {/* Lower - Job History and About */}
                                {isMobile ? 
                                <div> {/* MOBILE */}
                                    {/* About */}
                                    <h2 style={{ fontWeight: 'bold' }}>About</h2>
                                    <hr />
                                    {/* Left - About Info */}
                                    <h4>Bio</h4>
                                    {user.bio ?
                                        <p>{user.bio}</p>
                                        :
                                        <p>User bio</p>
                                    }

                                    {/* <h4>Liked Jobs</h4>
                                    <p>Selected liked job categories from survey</p> */}

                                    <h4>Contact Info</h4>
                                    {/* Phone */}
                                    <Row>
                                        <Col xs="2"><p>Phone:</p></Col>
                                        {user ?
                                            <Col xs="10"><p>{formatPhoneNumber(user.phoneNumber)}</p></Col>
                                            :
                                            <Col xs="10"><p>###-###-####</p></Col>
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
                                    {/* Right - Location */}
                                    {user ?
                                        <div>
                                            <h4>Address</h4>
                                            {user.address === '' ?
                                                <p>No Address Set</p>
                                                :
                                                <p>{user.address}</p>
                                            }
                                            {/* <MapContainer className="leaflet-container" center={[userLat, userLong]} zoom={15} scrollWheelZoom={false} style={{ height: "200px" }} >
                                            <TileLayer
                                                url="https://api.mapbox.com/styles/v1/sanchezer1757/cki7qwrxp2vlt1arsifbfcccx/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2FuY2hlemVyMTc1NyIsImEiOiJja2k3cXUzbzExbDNtMnRxc2NlZnFnenJ2In0.zCSSQC8m87qtzSpfQS7Y8A" 
                                                attribution='<a href="/">OddJobs</a>'
                                            />
                                                <Circle center={[userLat, userLong]} pathOptions={{ color: 'blue', fillColor: 'blue' }} radius={150}>
                                                    <Tooltip sticky>Radius Users See</Tooltip>
                                                </Circle>
                                                <Marker position={[userLat, userLong]}><Tooltip>Where You Are</Tooltip></Marker>
                                            </MapContainer> */}
                                        </div> : <div></div>
                                    }

                                    {/* Job Categories */}
                                    <h4>Job Categories</h4>

                                    {/* Liked Categories */}
                                    <Row>
                                        <Col xs="2"><p>Interested:</p></Col>
                                        {user.email !== '' ?
                                            <Col xs="10"><p>{user.mostInterestedCategory}</p></Col>
                                            :
                                            <Col xs="10"><p>Interested</p></Col>
                                        }
                                    </Row>

                                    {/* Disliked Categories */}
                                    <Row>
                                        <Col xs="2"><p>Disinterested:</p></Col>
                                        {user.email !== '' ?
                                            <Col xs="10"><p>{user.leastInterestedCategory}</p></Col>
                                            :
                                            <Col xs="10"><p>Disinterested Categories</p></Col>
                                        }
                                    </Row>

                                    <Row>
                                        <Col>
                                            <h2 style={{ fontWeight: 'bold' }}>Posted Tasks</h2>
                                            <hr />
                                            <div style={{width: 300}}><PostTasksCarousel /></div>
                                        </Col>
                                    </Row>
                                                    
                                    <Row>
                                        <Col>
                                            <h2 style={{ fontWeight: 'bold' }}>Tasks Completed</h2>
                                            <hr />
                                            <div style={{width: 300}}><TasksCompletedCarousel /></div>
                                        </Col>
                                    </Row>
                                </div>
                                :
                                <div>
                                <Row> {/* NORMAL */}
                                    {/* Right - About */}
                                    <Col>
                                        <h2 style={{ fontWeight: 'bold' }}>About</h2>
                                        <hr />
                                        <Row>
                                            {/* Left - About Info */}
                                            <Col xs="6">
                                                <h4>Bio</h4>
                                                {user.bio ?
                                                    <p>{user.bio}</p>
                                                    :
                                                    <p>User bio</p>
                                                }

                                                <h4>Contact Info</h4>
                                                {/* Phone */}
                                                <Row>
                                                    <Col xs="2"><p>Phone:</p></Col>
                                                    {user.phoneNumber !== '' ?
                                                        <Col xs="10"><p>{formatPhoneNumber(user.phoneNumber)}</p></Col>
                                                        :
                                                        <Col xs="10"><p>###-###-####</p></Col>
                                                    }  
                                                </Row>
                                                {/* Email */}
                                                <Row>
                                                    <Col xs="2"><p>Email:</p></Col>
                                                    {user.email !== '' ?
                                                        <Col xs="10"><p>{user.email}</p></Col>
                                                        :
                                                        <Col xs="10"><p>youremail@email.com</p></Col>
                                                    }
                                                </Row>
                                            </Col>
                                            {/* Right - Location */}
                                            <Col xs="6">
                                                {user ?
                                                    <div>
                                                        <h4>Address</h4>
                                                        {user.address === '' ?
                                                            <p>No Address Set</p>
                                                            :
                                                            <p>{user.address}</p>
                                                        }
                                                        {/* <MapContainer className="leaflet-container" center={[userLat, userLong]} zoom={15} scrollWheelZoom={false} style={{ height: "200px" }} >
                                                        <TileLayer
                                                            url="https://api.mapbox.com/styles/v1/sanchezer1757/cki7qwrxp2vlt1arsifbfcccx/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2FuY2hlemVyMTc1NyIsImEiOiJja2k3cXUzbzExbDNtMnRxc2NlZnFnenJ2In0.zCSSQC8m87qtzSpfQS7Y8A" 
                                                            attribution='<a href="/">OddJobs</a>'
                                                        />
                                                            <Circle center={[userLat, userLong]} pathOptions={{ color: 'blue', fillColor: 'blue' }} radius={150}>
                                                                <Tooltip sticky>Radius Users See</Tooltip>
                                                            </Circle>
                                                            <Marker position={[userLat, userLong]}><Tooltip>Where You Are</Tooltip></Marker>
                                                        </MapContainer> */}
                                                    </div> : <div></div>
                                                }

                                                {/* Job Categories */}
                                                <h4>Job Categories</h4>

                                                {/* Liked Categories */}
                                                <Row>
                                                    <Col xs="2"><p>Interested:</p></Col>
                                                    {user.email !== '' ?
                                                        <Col xs="10"><p>{user.mostInterestedCategory}</p></Col>
                                                        :
                                                        <Col xs="10"><p>Interested</p></Col>
                                                    }
                                                </Row>

                                                {/* Disliked Categories */}
                                                <Row>
                                                    <Col xs="2"><p>Disinterested:</p></Col>
                                                    {user.email !== '' ?
                                                        <Col xs="10"><p>{user.leastInterestedCategory}</p></Col>
                                                        :
                                                        <Col xs="10"><p>Disinterested Categories</p></Col>
                                                    }
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    
                                </Row>
                                <br />
                                <Row>
                                    <Col>
                                        <h2 style={{ fontWeight: 'bold' }}>Posted Tasks</h2>
                                        <hr />
                                        <div style={{width: 300}}><PostTasksCarousel/></div>
                                    </Col>
                                {/* </Row>          
                                <Row> */}
                                    <Col>
                                        <h2 style={{ fontWeight: 'bold' }}>Tasks Completed</h2>
                                        <hr />
                                        <div style={{width: 300}}><TasksCompletedCarousel /></div>
                                    </Col>
                                </Row>
                                </div>
                                
                                }
                            </Container>
                        )

                    case 'edit profile':
                        var address = user.address.split(', ')

                        return (
                            <Container onSubmit={editProfile}>
                                <h1 id="centered" style={{ fontWeight: 'bold' }}>Edit Profile</h1>
                                <br />
                                <div className="centered">
                                    <Formik initialValues={{ 
                                            email: user.email, 
                                            name: user.name, 
                                            preferredName: user.preferredName, 
                                            phoneNumber: user.phoneNumber, 
                                            address: address[0],
                                            city: address[1],
                                            state: address[2],
                                            zip: address[3]
                                        }} onSubmit={data => editProfile(data)}
                                    >
                                        <Form>
                                            {/* Row 1 - Change Name */}
                                            <Row>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="name"><h4>Full Name</h4></Label>
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
                                                {/*
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
                                                        />                                            
                                                    </FormGroup>
                                                </Col> */}
                                                
                                                <Col className="centered">
                                                    <FormGroup>
                                                        <Label for="bio"><h4>Bio</h4></Label>
                                                        <Field name='bio' type='textarea' placeholder={user.bio} as={Input} />
                                                    </FormGroup>                                                                                                       
                                                </Col>
                                            </Row>
                                            <hr />

                                            {/* Row 4 - Address 1 & Address 2 */}
                                            <Row>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="address"><h4>Address</h4></Label>
                                                        <Field type="text" name="address" id="address" placeholder={address[0]} as={Input} />
                                                    </FormGroup>
                                                </Col>
                                                {/* <Col>
                                                    <FormGroup>
                                                        <Label for="address2"><h4>Address 2</h4></Label>
                                                        <Field type="text" name="address2" id="address2" placeholder="Apartment, studio, floor, etc." as={Input} />
                                                    </FormGroup>
                                                </Col> */}
                                            </Row>

                                            {/* Row 5 - City - State - Zip */}
                                            <Row>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <Label for="city"><h4>City</h4></Label>
                                                        <Field type="text" name="city" id="city" placeholder={address[1]} as={Input} />
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
                                                        <Field type="text" name="zip" id="zip" placeholder={address[3]} as={Input} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Row>
                                                {/*Manage funds buttons*/}
                                                {/* <Col>
                                                    <h3 style={{ fontWeight: 'bold' }}>Manage Funds</h3>
                                                    <hr />
                                                    <Button className="centered" outline color="warning" size="sm">Deposit Funds</Button>{' '}
                                                    <br />
                                                    <Button className="centered" outline color="primary" size="sm">Withdraw Funds</Button>{' '}
                                                </Col> */}
                                                
                                                {/*Account deletion*/}
                                                <Col>
                                                    <h3 style={{ fontWeight: 'bold' }}>Delete Account</h3>
                                                    <hr />
                                                    {/* <Button className="centered" color="danger" size="sm" >Delete Account</Button> */}
                                                    <Button color="danger" size="sm" id="confirmDelete" type="button" outline>Delete Account</Button>
                                                </Col>
                                                <UncontrolledPopover placement="bottom" target="confirmDelete" style={{padding: 10}}>
                                                    <h3>Are you sure?</h3>
                                                    <PopoverBody>This cannot be undone</PopoverBody>
                                                    <Button color="danger" size="sm" type="submit" onClick={deleteAccount}>Confirm</Button>
                                                    <br />
                                                </UncontrolledPopover>
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