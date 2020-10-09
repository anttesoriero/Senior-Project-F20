import React from 'react';
import Navigation from '../Components/Navigation';
import {Container, Row, Col, Button, Media} from 'reactstrap';
import ErrorImage from "../Styles/Images/SurprisedOtterError.png"

const ErrorPage = () => {
    return (
        <div>
            <Navigation/>
            <Container>

                <br/>

                <Media id="centered">
                    <Media object src={ErrorImage} alt="ERROR IMAGE" height="200"/>
                </Media>

                <h1 id="centered" style={{ fontWeight: 'bold' }}>Uh-oh, something's wrong!</h1>
                <h2 id="centered" style={{ fontWeight: 'bold' }}>ERROR [ID]: [MESSAGE]</h2>

                <br/>

                <Row>
                    <Col><hr/></Col>
                    <Col id="centered"><Button href="javascript:history.go(-1)" color="secondary" size="lg">Go Back</Button></Col>
                    <Col id="centered"><Button href="/" color="primary" size="lg">Go Home</Button></Col>
                    <Col><hr/></Col>
                </Row>

                <br/>

                <h3 id="centered">Not what you expected?</h3>
                <Row id="centered"><Button href="/contact" outline color="info">Contact Us</Button></Row>






            </Container>
        </div>
    );
}

export default ErrorPage;