import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Container, Jumbotron, Row, Col, Alert } from 'reactstrap';
import Navigation from '../Components/Navigation';
import AuthTabs from '../Components/AuthTabs';
import Footer from "../Components/Footer";
import CardCategories from '../Components/CardCategories';

type event = {
    email: string,
    password: string
};

const LandingPage = () => {
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);


    return (
        <div>
            <Navigation />

            <Jumbotron fluid>
                <Container >
                    <Row>
                        {/* Left - Main info */}
                        <Col xs="8">
                            <h1 className="display-3">OddJobs</h1>
                            <p className="lead">No Job is too Odd</p>
                        </Col>

                        {/* Right - Login */}
                        <Col xs="4">
                            <AuthTabs />
                        </Col>
                    </Row>
                </Container>
            </Jumbotron>

            <CardCategories />

            <Footer />

            {/* Cookie Alert */}
            <Alert id="myAlert-bottom" className="centered" color="warning" isOpen={visible} toggle={onDismiss}>
                <text style={{ color: "black" }}>We use cookies on this site to better your experience. <a href="/privacy" className="alert-link">Learn More</a></text>
            </Alert>
        </div>
    );
}


export default withRouter(LandingPage);