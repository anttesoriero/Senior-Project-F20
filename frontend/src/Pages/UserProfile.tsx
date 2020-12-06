import React, { useEffect, useState, useContext } from 'react';
import Navigation from '../Components/Navigation';
import { Container, Row, Col, Button, Media, Input, Label, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Footer from "../Components/Footer";
import axios from 'axios';
import 'reactjs-popup/dist/index.css';
import { Formik, Form, Field } from 'formik';
import APIContext from '../Contexts/APIContext';

type userState = {
    email: string,
    name: string,
    preferredName: string,
    accountBalance: number,
    address: string,
    phoneNumber: string,
    bio: string,
    profilePicture: string,
    posterRating: number | null,
    workerRating: number | null
}

const userInfo = {
    email: "",
    name: "",
    preferredName: "",
    accountBalance: 0,
    address: "",
    phoneNumber: "",
    bio: "",
    profilePicture: "",
    posterRating: null,
    workerRating: null
}

const UserProfile = () => {
    const token = localStorage.getItem('access_token');
    const url = useContext(APIContext);
    const isMobile = window.innerWidth < 1000;

    const [user, setUser] = useState<userState>(userInfo);
    const [initials, setInitials] = useState<String>("");
    const [modal, setModal] = useState(false);

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

    const getUser = async () => {
        console.log(window.location.href.slice(-1))
        await axios.get(url + 'user/getBriefProfile?otherUser=' + window.location.href.slice(-1),
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

    const reportUser = async (values) => {
        const userId_2 = window.location.href.slice(-1)
        console.log('values: ', values)
        await axios.put(url + 'me/reportUser', {
            userId_2: userId_2,
            reportType: values.picked,
            description: values.description
        },
        { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
            toggle()
        })
        .catch(error => {
            console.log(error);
        });
        return
    }

    const computeUserRating = () => {
        const { workerRating, posterRating } = userInfo
        if (workerRating === null && posterRating === null) {
            return 'No Ratings Yet'
        }
        if (workerRating === null) {
            return `${posterRating}`
        }
        if (posterRating === null) {
            return `${workerRating}`
        }
        const averageRating = (workerRating! + posterRating!) / 2
        return `${averageRating}`
    }

    const toggle = () => setModal(!modal);

    useEffect(() => {
        getUser();
    });

    return (
        <div>
            <Navigation/>
            <Container>
                <h1 id="centered" style={{ fontWeight: 'bold' }}>User Page</h1>
                <br />
                {/* Upper - Main user info and edit button */}
                {isMobile ?
                    <div> {/* MOBILE */}
                        {/* User Info */}
                        <Media>
                            <Media left href="#">
                                {user.profilePicture === "" ?                                                
                                    <Button disabled style={{borderRadius: 10, fontSize: 60, marginTop: '10%', paddingLeft: 30, paddingRight: 30}}>
                                        {initials}
                                    </Button>
                                :
                                    <Media object src={user.profilePicture} alt="Generic placeholder image" height="160" width="160" />
                                }        
                            </Media>
                            <Media body style={{ padding: 10 }}>
                                <div style={{ marginTop: '-3%', marginLeft: '3%' }}>
                                    <h4>{user.name}</h4>
                                    <h5>Goes by: 
                                        {user.preferredName ? " " + user.preferredName : ' ' + user.name.split(' ')[0]}
                                    </h5>
                                
                                    <p>Rating: {computeUserRating()}</p>
                                </div>
                            </Media>
                        </Media>
                    </div>
                :
                    <Row> {/* NORMAL */}
                        {/* Left - Prof Pic, name, and basic info */}
                        <Col xs="10">
                            <Media>
                                <Media left href="#">
                                    {user.profilePicture === "" ?                                                
                                        <Button disabled style={{borderRadius: 10, fontSize: 60, marginTop: '10%', paddingLeft: 30, paddingRight: 30}}>
                                            {initials}
                                        </Button>
                                    :
                                        <Media object src={user.profilePicture} alt="Generic placeholder image" height="160" width="160" />
                                    }        
                                </Media>
                                <Media body style={{ padding: 10 }}>
                                    <div style={{ marginTop: '-3%', marginLeft: '3%' }}>
                                        <h4>{user.name}</h4>
                                        <h5>Goes by: 
                                    {/* {user.preferredName} */}
                                            {user.preferredName ? " " + user.preferredName : ' ' + user.name.split(' ')[0]}
                                        </h5>
                                        <p>Rating: {computeUserRating()}</p>
                                    </div>
                                </Media>
                            </Media>
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
                        {user ?
                            <Col><p>{user.bio}</p></Col>
                            :
                            <Col><p>User bio</p></Col>
                        }
                        <h4>Liked Jobs</h4>
                        <p>Selected liked job categories from survey</p>
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
                        <Button onClick={toggle} outline color="danger" size="sm" style={{height: '40%'}}>Report User</Button>{' '}
                        <Modal isOpen={modal} toggle={toggle}>
                            <ModalHeader toggle={toggle}>Report this User</ModalHeader>
                            <ModalBody>
                                Please select the category that this user violated:
                                <Formik
                                    initialValues={{
                                        picked: '',
                                    }}
                                    onSubmit={values => reportUser(values)}
                                >
                                    {({ values }) => (
                                        <Form>
                                        <div role="group" aria-labelledby="my-radio-group">
                                            <label>
                                                <Field type="radio" name="picked" value="One" />
                                                One
                                            </label>
                                            <br />

                                            <label>
                                                <Field type="radio" name="picked" value="Two" />
                                                Two
                                            </label>
                                            <br />

                                            <label>
                                                <Label for="description">Please provide details as to why you are reporting this user</Label>
                                                <Field type="textarea" name="description" placeholder="Description" required as={Input} />
                                            </label>
                                            <br />
                                        </div>

                                        <br />
                                        <Button color="danger" type="submit">Report</Button>{' '}

                                        {/* <button type="submit">Submit</button> */}
                                        </Form>
                                    )}
                                </Formik>
                            </ModalBody>
                            {/* <ModalFooter>
                            <Button color="primary" type="submit" onClick={reportUser}>Report</Button>{' '}
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                            </ModalFooter> */}
                        </Modal>

                        {/* Right - Location */}
                            {/* {user ?
                                <div>
                                    <h4>Address</h4>
                                    {user ?
                                        <p>{user.address}</p>
                                        :
                                        <p>123 Main St, City, ST 12345</p>
                                    }
                                    <MapContainer className="leaflet-container" center={[39.7089, -75.1183]} zoom={15} scrollWheelZoom={false} style={{ height: "200px" }} >
                                    <TileLayer
                                        url="https://api.mapbox.com/styles/v1/sanchezer1757/cki7qwrxp2vlt1arsifbfcccx/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2FuY2hlemVyMTc1NyIsImEiOiJja2k3cXUzbzExbDNtMnRxc2NlZnFnenJ2In0.zCSSQC8m87qtzSpfQS7Y8A" 
                                        attribution='<a href="/">OddJobs</a>'
                                    />
                                        <Circle center={[39.7089, -75.1183]} pathOptions={{ color: 'blue', fillColor: 'blue' }} radius={150}>
                                            <Tooltip sticky>Radius Users See</Tooltip>
                                        </Circle>
                                        <Marker position={[39.7089, -75.1183]}><Tooltip>Where You Are</Tooltip></Marker>
                                    </MapContainer>
                                </div> : <div></div>} */}
                    
                    {/* History -- NOTE: Styled correctly, but commented since we're not using it yet
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
                        </Row>
                    </div> */}
                </div>
                :
                <Row> {/* NORMAL */}
                    {/* Left - Job History */}
                    {/* <Col xs="4">
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
                        </div>
                    </Col> */}
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
                            </Col>
                            <Button onClick={toggle} outline color="danger" size="sm" style={{height: '40%'}}>Report User</Button>{' '}
                            <Modal isOpen={modal} toggle={toggle}>
                                <ModalHeader toggle={toggle}>Report this User</ModalHeader>
                                <ModalBody>
                                    Please select the category that this user violated:
                                    <Formik
                                        initialValues={{
                                            picked: '',
                                        }}
                                        onSubmit={values => reportUser(values)}
                                    >
                                        {({ values }) => (
                                            <Form>
                                            <div role="group" aria-labelledby="my-radio-group">
                                                <label>
                                                    <Field type="radio" name="picked" value="One" />
                                                    One
                                                </label>
                                                <br />

                                                <label>
                                                    <Field type="radio" name="picked" value="Two" />
                                                    Two
                                                </label>
                                                <br />

                                                <label>
                                                    <Label for="description">Please provide details as to why you are reporting this user</Label>
                                                    <Field type="textarea" name="description" placeholder="Description" required as={Input} />
                                                </label>
                                                <br />
                                            </div>

                                            <br />
                                            <Button color="danger" type="submit">Report</Button>{' '}

                                            {/* <button type="submit">Submit</button> */}
                                            </Form>
                                        )}
                                    </Formik>
                                </ModalBody>
                                {/* <ModalFooter>
                                <Button color="primary" type="submit" onClick={reportUser}>Report</Button>{' '}
                                <Button color="secondary" onClick={toggle}>Cancel</Button>
                                </ModalFooter> */}
                            </Modal>

                            {/* Right - Location */}
                            {/* <Col xs="6">
                                {user ?
                                    <div>
                                        <h4>Address</h4>
                                        {user ?
                                            <p>{user.address}</p>
                                            :
                                            <p>123 Main St, City, ST 12345</p>
                                        }
                                        <MapContainer className="leaflet-container" center={[39.7089, -75.1183]} zoom={15.5} scrollWheelZoom={false} style={{ height: "200px" }} >
                                        <TileLayer
                                            url="https://api.mapbox.com/styles/v1/sanchezer1757/cki7qwrxp2vlt1arsifbfcccx/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2FuY2hlemVyMTc1NyIsImEiOiJja2k3cXUzbzExbDNtMnRxc2NlZnFnenJ2In0.zCSSQC8m87qtzSpfQS7Y8A" 
                                            attribution='<a href="/">OddJobs</a>'
                                        />
                                            <Circle center={[39.7089, -75.1183]} pathOptions={{ color: 'blue', fillColor: 'blue' }} radius={150}>
                                                <Tooltip sticky>Radius Users See</Tooltip>
                                            </Circle>
                                            <Marker position={[39.7089, -75.1183]}><Tooltip>Where You Are</Tooltip></Marker>
                                        </MapContainer>
                                    </div> : <div></div>}
                            </Col> */}
                        </Row>
                    </Col>
                </Row>}
            </Container>
            <Footer/>
        </div>
    )
}

export default UserProfile;