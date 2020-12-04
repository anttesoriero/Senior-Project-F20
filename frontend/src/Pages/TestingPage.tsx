import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import {  } from 'reactstrap';
import Footer from "../Components/Footer";

const TestingPage = () => {
    const token = localStorage.getItem('access_token');

    return (
        <div>
            <Navigation />

            <Footer />

        </div>
    );
}

export default TestingPage;