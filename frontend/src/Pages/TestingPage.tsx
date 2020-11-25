import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import { Button, Card, CardBody, Col, Collapse, Container, Row } from 'reactstrap';
import Footer from "../Components/Footer";
import axios from 'axios';
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import TaskCard from '../Components/TaskCard';
import RefineSearch from '../Components/RefineSearch';
import PaginationRow from '../Components/PaginationRow';
import { LatLngTuple } from 'leaflet';
import MapsCircle from '../Components/MapsCircle';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

const TestingPage = () => {
    const token = localStorage.getItem('access_token');

    const centerLocation: LatLngTuple = [39.7089, -75.1183]
    const sample: LatLngTuple = [39.7051596, -75.11357028778912]

    const latTest: number = 39.7089;
    const lngTest: number = -75.1183;

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
                        <TaskCard id={1} title="title" offerer={1} price={10} description="desc" duration={10} />

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
                    {/* <Map google={this.props.google} zoom={14}>
                    
                        <Marker onClick={this.onMarkerClick}
                                name={'Current location'} />

                        <InfoWindow onClose={this.onInfoWindowClose}>
                            <div>
                            <h1>{this.state.selectedPlace.name}</h1>
                            </div>
                        </InfoWindow>
                    </Map> */}
                </Col>
            </Row>

        </div>
    );
}

export default TestingPage;