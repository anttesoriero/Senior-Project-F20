import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import { Button, Card, CardBody, Col, Collapse, Container, Row } from 'reactstrap';
import Footer from "../Components/Footer";
import axios from 'axios';
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import TaskCard from '../Components/TaskCard';
import RefineSearch from '../Components/RefineSearch';
import PaginationRow from '../Components/PaginationRow';
import { TileLayer, Marker, Popup, MapContainer, CircleMarker, Tooltip, Circle } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import MapsCircle from '../Components/MapsCircle';
import Geocode from 'react-geocode'

// react-geocode setup
Geocode.setApiKey("AIzaSyBcriJb-SLk7ljQmh1P_L9MaiNj8VbZj_o");  // Google Maps API Key from Dan
// Geocode.setApiKey("AIzaSyArphxvQgThDCur8DpOhtwO0sAheLh4_n8");  // Testing second free API Key from Anthony

Geocode.setLanguage("en");  // Set Language
Geocode.setRegion("us");  // Set Region

// Get address from latitude & longitude.
Geocode.fromLatLng("48.8583701", "2.2922926").then(
    response => {
        const address = response.results[0].formatted_address;
        console.log(address);
    },
    error => {
        console.error(error);
    }
);

// Get latitude & longitude from address.
Geocode.fromAddress("Eiffel Tower").then(
    response => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
    },
    error => {
        console.error(error);
    }
);



const TestingPage = () => {
    const token = localStorage.getItem('access_token');

    const centerLocation: LatLngTuple = [39.7089, -75.1183]
    const sample: LatLngTuple = [39.7051596, -75.11357028778912]

    const latTest: number = 39.7089;
    const lngTest: number = -75.1183;

    //- Not working
    const getCoords = (lat, lng) => {
        Geocode.fromLatLng(String(lat), String(lng)).then(
            response => {
                const address = response.results[0].formatted_address;
                console.log(address);
            },
            error => {
                console.error(error);
            }
        )
    }

    Geocode.fromLatLng(String(latTest), String(lngTest))

    const getLoc = (address) => {
        Geocode.fromAddress(address).then(
            response => {
                const { lat, lng } = response.results[0].geometry.location;
                console.log(lat, lng);
            },
            error => {
                console.error(error);
            }
        )
    }
    //-

    return (
        <div>
            <Navigation />

            {/* Search Bar */}
            <RefineSearch className="centered" />

            <Row>
                {/* Left - TaskCards */}
                <Col xs="4" className="col-scroll">
                    <Container>
                        <h3 id="top" className="centered">Tasks</h3>
                        <hr /><hr /><hr />
                        <h3 className="centered"><b>Geocode Testing</b></h3>

                        {/* <h4>Lat, Lng: {latTest}, {lngTest}</h4> */}
                        <h4>Lat, Lng: "48.8583701", "2.2922926"</h4>
                        <h4>Address: Eiffel Tower</h4>
                        <hr />
                        <h4>
                            Address from Coords: {getCoords("48.8583701", "2.2922926")}
                        </h4>
                        <h4>
                            Coords from Address: {getLoc("Eiffel Tower")}
                        </h4>

                        {/* <h4>
                                Address: {Geocode.fromLatLng(String(latTest), String(lngTest))}
                            </h4> */}

                        <hr /><hr /><hr />
                        <TaskCard id={1} title="title" offerer='tester' price={10} description="desc" duration={10} />

                        <h4 className="centered">No More Tasks in this Area</h4>
                        <br />
                        <div><Button className={'task centered'} href="#top">Back to Top</Button></div>
                        <br />

                        <div className='centered'>
                            <PaginationRow />
                        </div>

                    </Container>

                    <Footer />
                </Col>

                <Col xs="8">
                    <MapContainer className="leaflet-container" center={centerLocation} zoom={15} scrollWheelZoom={true} >
                        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* Map Circle Markers - MapsCircle */}
                        <MapsCircle title='TITLE' categoryId={1} amount={10} duration={60} latitude={39.7089} longitute={-75.1183} />

                    </MapContainer>
                </Col>
            </Row>

        </div>
    );
}

export default TestingPage;