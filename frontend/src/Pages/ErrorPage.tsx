import React from 'react';
import { useHistory } from "react-router-dom";
import Navigation from '../Components/Navigation';
import {Container, Row, Col, Button, Media} from 'reactstrap';
import ErrorImage from "../Styles/Images/SurprisedOtterError.png"
import Footer from '../Components/Footer';

const ErrorPage = () => {
    let history = useHistory();
    return (
        <div>
            <Navigation />
            <Container>

                <br/>

                <Media id="centered">
                    <Media object src={ErrorImage} alt="ERROR IMAGE" height="200"/>
                </Media>

                <h2 id="centered" style={{ fontWeight: 'bold' }}>ERROR 404</h2>
                <h1 id="centered" style={{ fontWeight: 'bold' }}>Looks like you're lost!</h1>

                <br/>

                <Row>
                    <Col><hr/></Col>
                    <Col id="centered"><Button onClick={() => history.goBack()} color="secondary" size="lg">Go Back</Button></Col>
                    <Col id="centered"><Button href="/" color="primary" size="lg">Go Home</Button></Col>
                    <Col><hr/></Col>
                </Row>

                <br/>

                <h3 id="centered">Not what you expected?</h3>
                <br/>
                <Row id="centered"><Button href="/contact" outline color="info">Contact Us</Button></Row>

                <br/>

            </Container>
            <br />
            <Footer/>
        </div>
    );
}

export default ErrorPage;