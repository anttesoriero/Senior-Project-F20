import React from 'react';
import {Col, Container, Row} from "reactstrap";
import "../Styles/Pages/footer.scss"

const Footer = () => {
    return (
        <div>
            <footer>
                <Container>

                    <br />
                    {/* Upper - Menu */}
                    <Row>
                        {/* Left - Menu */}
                        <Col xs="6" sm="4">
                            <h6>Menu</h6>
                            <p><a href="/">Home</a></p>
                            <p><a href="/taskboard">Task Board</a></p>
                            <p><a href="/profile">Profile</a></p>
                        </Col>

                        {/* Middle - About */}
                        <Col xs="6" sm="4">
                            <h6>About</h6>
                            <p><a href="/about">About Us</a></p>
                            <p><a href="/privacy">Privacy</a></p>
                            <p><a href="https://github.com/anttesoriero/Senior-Project-F20" target="_blank">GitHub</a></p>
                        </Col>

                        {/* Right - Help */}
                        <Col sm="4">
                            <h6>HELP</h6>
                            <p><a href="/contact">Contact</a></p>
                            <p><a href="/getstarted">Get Started</a></p>
                            <p><a href="/terms">Terms</a></p>
                        </Col>
                    </Row>

                    <br />
                    <hr />

                    {/* Lower - Name & Copyright */}
                    <Row>
                        {/* Left - Name */}
                        <Col xs="10">
                            <h6><a href="/">ODDJOBS</a></h6>
                        </Col>

                        {/* Right - Copyright */}
                        <Col xs="2" id="right">
                            <p id="centered">Copyright &copy; 2020</p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
}

export default Footer;