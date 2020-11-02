import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import {Col, Container, Row} from 'reactstrap';
import Footer from "../Components/Footer";
import axios from 'axios';
import Maps from "../Components/Maps";
// import {Map, L} from 'leaflet';
// <script src="holder.js"/>


const TestingPage = () => {
    return (
        <div>
            <Navigation/>
            <Container>
                <h1>React-Leaflet Map (Maps Component)</h1>
                <br />
                
                <h5>Scrollable - Inside Container</h5>
                <Maps scrollBool={true} />

                <br />
                <h5>Not Scrollable - Outside Container</h5>
            </Container>
            
            <Maps scrollBool={false} />
            <br />
            <Footer/>
        </div>
    );
}

export default TestingPage;