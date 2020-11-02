import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import {Container} from 'reactstrap';
import Footer from "../Components/Footer";
import PlaceholderImage from "../Styles/Images/placeholder.jpg";
import axios from 'axios';
import Maps from "../Components/Maps";
// import {Map, L} from 'leaflet';
// <script src="holder.js"/>


const TestingPage = () => {
    return (
        <div>
            <Navigation/>
            <Container>
                <h1>React-Leaflet Map</h1>
                <h5>Use "Maps" Component</h5>
                <Maps />
            </Container>
            <br />
            <Footer/>
        </div>
    );
}

export default TestingPage;