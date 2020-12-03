import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Jumbotron, Row, Col, Alert } from 'reactstrap';
import Navigation from '../Components/Navigation';
import AuthTabs from '../Components/AuthTabs';
import Footer from "../Components/Footer";
import CardCategories from '../Components/CardCategories';

const LandingPage = () => {
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);

    const contextType = localStorage.getItem('access_token');

    const isMobile = window.innerWidth < 1000;

    return (
        <div>
            <Navigation />
            {isMobile ? 
                // Mobile
                <Jumbotron fluid>
                    <Container >
                        {!contextType ?
                            <div>
                                <div>
                                    <h1 className="display-3" style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bolder' }}>OddJobs</h1>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <p className="lead" style={{ fontWeight: 'bolder' }}>No Job is too Odd</p>
                                    </div>
                                </div>
                                <br />
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <AuthTabs />
                                </div>
                            </div>
                            :
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div>
                                    <h1 className="display-3" style={{ fontWeight: 'bolder' }}>OddJobs</h1>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <p className="lead" style={{ fontWeight: 'bolder' }}>No Job is too Odd</p>
                                    </div>
                                </div>
                            </div>
                        }
                    </Container>
                </Jumbotron>
            : 
                // Normal
                <Jumbotron fluid>
                    <Container >
                        {!contextType ?
                            <Row>
                                {/* Left - Main info */}
                                <Col xs="8">
                                    <h1 className="display-3" style={{ fontWeight: 'bolder' }}>OddJobs</h1>
                                    <p className="lead" style={{ fontWeight: 'bolder' }}>No Job is too Odd</p>
                                </Col>

                                {/* Right - Login */}
                                <Col xs="4">
                                    <AuthTabs />
                                </Col>
                            </Row>
                            :
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div>
                                    <h1 className="display-3" style={{ fontWeight: 'bolder' }}>OddJobs</h1>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <p className="lead" style={{ fontWeight: 'bolder' }}>No Job is too Odd</p>
                                    </div>
                                </div>
                            </div>
                        }
                    </Container>
                </Jumbotron>
                
            }

            <CardCategories />

            <Footer />

            {/* Cookie Alert */}
            <Alert id="myAlert-bottom" className="centered" color="warning" isOpen={visible} toggle={onDismiss}>
                <p style={{ color: "black" }}>We use cookies on this site to better your experience. <a href="/privacy" className="alert-link">Learn More</a></p>
            </Alert>
        </div>
    );
}


export default withRouter(LandingPage);