import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import {Container, Row, Col, Button, Media, Badge} from 'reactstrap';
import Footer from "../Components/Footer";
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import axios from 'axios';

type userState = {
    email: string,
    firstName: string,
    lastName: string,
    accountBalance: number
}

const ListingPage = () => {
    const token = localStorage.getItem('access_token');
    const [user, setUser]  = useState<userState>();

    const getUser = async () => {
        {/* Example of sending authorized request. Get can take mulyiple parameters, in this case 2.
            First one is the endpoint and second is the authorization headers */}
        await axios.get('http://127.0.0.1:5000/me/getProfile', 
        { headers: { Authorization: `Bearer ${token}` } })
        .then( response => {
            console.log(response.data);
            setUser(response.data)
        })
        .catch( error => {
            console.log(error);
        });   
    }
    
    useEffect(()=> {
        getUser();
    }, []);

    return (
        <div>
            <Navigation/>
            <Container>
                <h1 id="centered" style={{ fontWeight: 'bold' }}>List a new Task</h1>
                <br/>

                
            </Container>
            <br />
            <Footer/>
        </div>
    );
}

export default ListingPage;