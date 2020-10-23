import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import {Container, Row, Col, Button, Media, Badge, Form, FormGroup, Input, Label, CustomInput} from 'reactstrap';
import Footer from "../Components/Footer";
import StateSelector from "../Components/StateSelector";
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

    return (
        <div>
            <Navigation/>
            <Container>
                <h1 id="centered" style={{ fontWeight: 'bold' }}>List a new Task</h1>
                <br/>

                <div className="centered">
                    <Form>
                        {/* Row 1 - Name & Category */}
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="taskTitle"><h4>Task Title</h4></Label>
                                    <Input type="text" name="taskTitle" id="taskTitle" placeholder="Lawn Mowing" required/>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="taskCategory"><h4>Task Category</h4></Label>
                                    <Input type="select" name="taskCategory" id="taskCategory" required>
                                        <option selected disabled>Select Category</option>
                                        <option>Cat 1</option>
                                        <option>Cat 2</option>
                                        <option>Cat 3</option>
                                        <option>Cat 4</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>

                        {/* Row 2 - Description & Tools */}
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="taskDesc"><h4>Task Description</h4></Label>
                                    <Input type="textarea" name="taskDesc" id="taskDesc" placeholder="Description" required/>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="taskTools"><h4>Required Tools</h4></Label>
                                    <div>
                                        <CustomInput type="checkbox" id="exampleCustomCheckbox" label="Tool 1" />
                                        <CustomInput type="checkbox" id="exampleCustomCheckbox" label="Tool 2" />
                                        <CustomInput type="checkbox" id="exampleCustomCheckbox" label="Tool 3" />
                                        <CustomInput type="checkbox" id="exampleCustomCheckbox" label="Tool 4" />
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>

                        {/* Pay Rate */}
                        <div className="centered">
                            <FormGroup>
                                <Label for="taskPayRate"><h5>$</h5></Label>
                                <Label inline for="taskPayRate"><h4 className="centered">Pay Rate</h4>
                                    <Input type="number" name="taskPayRate" id="taskPayRate" placeholder="60" min="15" required/>
                                </Label>
                            </FormGroup>
                        </div>

                        <hr />

                        {/* Row 3 - Date & Time */}
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="date"><h4>Date</h4></Label>
                                    <Input type="date" name="date" id="date" placeholder="01-20-2021" required/>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="time"><h4>Time</h4></Label>
                                    <Input type="time" name="time" id="time" placeholder="12:00PM" required/>
                                </FormGroup>
                            </Col>
                        </Row>

                        {/* Row 4 - Address 1 & Address 2 */}
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="address"><h4>Address</h4></Label>
                                    <Input type="text" name="address" id="address" placeholder="123 Main St" required/>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="address2"><h4>Address 2</h4></Label>
                                    <Input type="text" name="address2" id="address2" placeholder="Apartment, studio, floor, etc."/>
                                </FormGroup>
                            </Col>
                        </Row>

                        {/* Row 5 - City - State - Zip */}
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="city"><h4>City</h4></Label>
                                    <Input type="text" name="city" id="city" placeholder="Glassboro" required/>
                                </FormGroup>
                            </Col>
                            <Col md="4">
                                <FormGroup>
                                    <Label for="state"><h4>State</h4></Label>
                                    <StateSelector/>
                                </FormGroup>
                            </Col>
                            <Col md="2">
                                <FormGroup>
                                    <Label for="zip"><h4>Zip</h4></Label>
                                    <Input type="text" name="zip" id="zip" placeholder="08028"/>
                                </FormGroup>
                            </Col>
                        </Row>

                        <div className="centered"><Button color="primary" size="lg">List Task</Button></div>

                    </Form>
                </div>

            </Container>
            <br />
            <Footer/>
        </div>
    );
}

export default ListingPage;