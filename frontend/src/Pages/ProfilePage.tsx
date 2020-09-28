import React from 'react';
import Navigation from '../Components/Navigation';
import { Container, Row, Col, Button, Media } from 'reactstrap';
import "../Styles/profile_page.scss"; // profile_page.scss file in Styles folder

const ProfilePage = () => {
    return (
        <div>
            <Navigation/>
            <Container>
                <h1 id="centered">Profile Page</h1>
                <br/>

                <Row>
                    {/* Left Column */}
                    <Col xs="8">
                        <Media>
                            <Media left href="#">
                                <Media object data-src="../Styles/holder.js/64x64" alt="Generic placeholder image" />
                            </Media>
                            <Media body>
                                <Media heading>
                                    [FIRST NAME] [LAST NAME]
                                </Media>
                                    Certified Contractor
                            </Media>
                        </Media>
                    </Col>

                    {/* Right Column */}
                    <Col xs="4" id="right">
                        <Button outline color="primary" size="sm">Edit Profile</Button>{' '}
                    </Col>

                </Row>

            </Container>


        </div>
    );
}

export default ProfilePage;