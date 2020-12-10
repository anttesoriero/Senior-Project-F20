import React, { useState } from 'react';
import Navigation from '../Components/Navigation';
import { Button, Form, FormGroup, Input, Label, Row, Col, Container } from 'reactstrap';
import Footer from "../Components/Footer";
import { Formik, Field } from 'formik';

const ContactPage = () => {

    const [pageState, setPageState] = useState<String>("contact")

    const toContact = () => {
        setPageState("contact")
    }

    const toSubmit = () => {
        setPageState("submit")
    }

    return (
        <div>
            <Navigation />

            <h1 className="centered">Contact Us</h1>

            {(() => { switch (pageState) {
                case 'contact':
                    return (
                        <Container className="centered">
                            <Formik initialValues={{ firstName: '', lastName: '', email: '', categoryId: 0, message: '' }} onSubmit={(data) => console.log(data)} >
                                <Form>
                                    {/* Row 1 - Name */}
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label for="title"><h4>First Name *</h4></Label>
                                                <Field type="text" name="firstName" placeholder="First Name" as={Input} required />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label for="title"><h4>Last Name *</h4></Label>
                                                <Field type="text" name="lastName" placeholder="Last Name" as={Input} required />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    {/* Row 2 - Email & Issue Category */}
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label for="title"><h4>Email *</h4></Label>
                                                <Field type="email" name="email" placeholder="Email" as={Input} required />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label for="categoryId"><h4>Issue Category *</h4></Label>
                                                <Field type="select" name="categoryId" as={Input} required>
                                                    {/* "Select Category" is value=1 because "Yard Work" 
                                                        keeps displaying first even though it's second.
                                                        When calling the endpoint, the categoryId is substracted by one. */}
                                                    <option value="0" disabled>Select Category</option>
                                                    <option value="1">General Issue</option>
                                                    <option value="4">Account Error</option>
                                                    <option value="5">Payment Error</option>
                                                    <option value="2">Feedback/Site Bug</option>
                                                    <option value="3">Missing Page</option>
                                                    <option value="6">Something Else</option>
                                                </Field>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    {/* Row 3 - Description & Pay Rate */}
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label for="taskDesc"><h4>Message *</h4></Label>
                                                <Field type="textarea" name="message" placeholder="Message" as={Input} maxLength="500" required/>
                                                <p id="charNum">500 character limit</p>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <div className='centered'>
                                        <p>* are required fields</p> <br />
                                    </div>
                                    <br />

                                    <Row className="centered">
                                        <Col xs="auto" className="centered"><Button href="/" color="primary" size="lg" disabled>Send Message</Button></Col>
                                    </Row>
                                    <p className="centered">~Contact submission currently disabled~</p>
                                    <br />

                                </Form>
                            </Formik>
                        </Container>)

                        case 'submit':
                            return (
                                <Container>
                                    <hr />
                                    <h2 className="centered">Thanks for contacting us!</h2>
                                    <h3 className="centered">We will get back to you soon!</h3>
                                    <br /><br />

                                    <Row className="centered">
                                        <Col xs="4" className="centered"><Button href="/" color="info" size="lg">Go Home</Button></Col>
                                    </Row>
                                    <br /><br /><br /><br /><br />
                                </Container>
                            )

                        default:
                            return null;
            }})()}

            <Footer />

        </div>
    );
}

export default ContactPage;