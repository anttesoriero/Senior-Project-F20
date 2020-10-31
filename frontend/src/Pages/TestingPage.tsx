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
                <h1>testing page top</h1>
                {/* Maps /> */}
                <h1>testing page bottom</h1>
            </Container>
            <br />
            <Footer/>
        </div>
    );
}

export default TestingPage;