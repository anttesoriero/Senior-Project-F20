import React from 'react';
import Navigation from '../Components/Navigation';
import { Container, Row, Col } from 'reactstrap';
import Footer from "../Components/Footer";

const AboutPage = () => {
    
    return (
        <div>
            <Navigation />

            <Container>
                <h1 className="centered">About Us</h1>
                <br />

                <h3><b>About</b></h3>
                <hr />
                <h5>
                    OddJobs is a service that will connect people who need help with small tasks (odd-jobs) with motivated people 
                    interested in an extra income! We intend for users to post requests for help with odd jobs such as moving a couch, 
                    picking up groceries, mowing the lawn, etc. Other users with free-time can negotiate the terms on filling the request. 
                    We will have users regularly complete surveys to better understand their preferences and optimize their experience.
                </h5>

                <h3><b>Built With</b></h3>
                <hr />
                <Row>
                    <Col>
                        <h4>Frontend</h4>
                        <hr />
                        <li>HTML</li>
                        <li>SASS</li>
                        <li>React.JS</li>
                        <li>Typescript</li>
                    </Col>
                    <Col>
                        <h4>Backend</h4>
                        <hr />
                        <li>Python3</li>
                        <li>Flask</li>
                        <li>MySQL</li>
                        <li>AWS EC2</li>
                    </Col>
                </Row>

                <h3><b>Team</b></h3>
                <hr />
                <Row>
                    <Col>
                        <h4>Frontend</h4>
                        <hr />
                        <li>Daniel Sanchez - <a href="https://github.com/danandressanchez">GitHub</a> - <a href="https://www.linkedin.com/in/dan-sanchez-7b8732162/">LinkedIn</a></li>
                        <li>Anthony Tesoriero - <a href="https://github.com/anttesoriero">GitHub</a> - <a href="https://www.linkedin.com/in/anttesoriero/">LinkedIn</a></li>
                        <li>Anthony Catalina - <a href="https://github.com/antcatalina">GitHub</a> - <a href="https://www.linkedin.com/in/anthony-catalina-062b31174/">LinkedIn</a></li>
                    </Col>
                    <Col>
                        <h4>Backend</h4>
                        <hr />
                        <li>Matthew Schofield - <a href="https://github.com/mattscho">GitHub</a> - <a href="https://www.linkedin.com/in/matthew-schofield-253a33189/">LinkedIn</a></li>
                        <li>Jasdip Dhillon - <a href="https://github.com/dhillonj2">GitHub</a> - <a href="https://www.linkedin.com/in/jasdip-dhillon-050a5719a/">LinkedIn</a></li>
                        <li>Nicholas Romeo - <a href="https://github.com/romeon728">GitHub</a> - <a href="https://www.linkedin.com/in/nicholas-romeo-05989b150">LinkedIn</a></li>
                    </Col>
                    <Col>
                        <h4>Wild-Card <span style={{fontSize: 15}}>(Frontend and Backend)</span></h4>
                        <hr />
                        <li>Steven Jiang - <a href="https://github.com/jiangs11">GitHub</a> - <a href="https://www.linkedin.com/in/steven-jiang-471453192/">LinkedIn</a></li>
                    </Col>
                </Row>

                <br />
                <h5 className="centered">Special thanks to Dr. Ganesh Baliga for advising us through this project - <a href="https://csm.rowan.edu/departments/cs/facultystaff/compsci_full_part/baliga.html">Rowan Bio</a></h5>

                <h5 className="centered">This project was made as part of Rowan CS Senior Project, Fall 2020 - <a href="https://csm.rowan.edu/departments/cs/index.html">Rowan CS</a></h5>

            </Container>

            <Footer />

        </div>
    );
}

export default AboutPage;