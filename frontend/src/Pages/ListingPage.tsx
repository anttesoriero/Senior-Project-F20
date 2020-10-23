import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import {Container, Row, Col, Button, Media, Badge, Form, FormGroup, Input, Label, CustomInput} from 'reactstrap';
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
                                    <Label for="taskName"><h4>Task Name</h4></Label>
                                    <Input type="text" name="taskName" id="taskName" placeholder="Task Name" required/>
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
                                    <Input type="textarea" name="taskDesc" id="taskDesc" placeholder="Task Description" required/>
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
                                <Label for="taskPayRate"><h4>Pay Rate</h4></Label>
                                <Input type="number" name="taskPayRate" id="taskPayRate" placeholder="$60" min="15" required/>
                            </FormGroup>
                        </div>
                    </Form>
                </div>

                <hr />

                
            </Container>
            <br />
            <Footer/>
        </div>
    );
}

export default ListingPage;