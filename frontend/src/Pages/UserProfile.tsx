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
    city: string,
    state: string,
    phoneNumber: string,
    website: string,
    bio: string
}

const userInfo = {
    email: "",
    name: "",
    preferredName: "",
    city: "",
    state: "",
    phoneNumber: "",
    website: "",
    bio: ""
}

const UserProfile = () => {
    const token = localStorage.getItem('access_token');
    const url = useContext(APIContext);

    const [user, setUser] = useState<userState>(userInfo);

    const getUser = async () => {
        {/* Example of sending authorized request. Get can take mulyiple parameters, in this case 2.
            First one is the endpoint and second is the authorization headers */}
        await axios.get(url + '/user/getProfile?otherUser',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
                setUser(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <Container>
            <h1 id="centered" style={{ fontWeight: 'bold' }}>User's Profile</h1>
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
                        <h4>Name</h4>
                            {user.preferredName ?
                                    <Col xs="10"><p>{user.preferredName}</p></Col>
                                    :
                                    <Col xs="10"><p>Goes by:</p></Col>
                                }
                        </Media>
                    </Media>
                </Col>

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
                            {user.bio ?
                                    <Col xs="10"><p>{user.bio}</p></Col>
                                    :
                                    <Col xs="10"><p>General bio for profile owner</p></Col>
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
                                <Col xs="10"><p>(555) 555-5555</p></Col>
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
                            <Row>
                                <Col xs="2"><p>Site:</p></Col>
                                {user.website ?
                                    <Col xs="10"><p>{user.website}</p></Col>
                                    :
                                    <Col xs="10"><p>website.com</p></Col>
                                }
                            </Row>
                        </Col>
                        {/* Right - Location */}
                        <Col xs="6">
                            {user ?
                                <div>
                                    <h4>Location</h4>
                                        <p>{user.city}, {user.state}</p>
                                        :
                                        <p>City, ST</p>

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
            </Row>
        </Container>
    )
}

export default UserProfile;