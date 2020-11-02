import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import {Container, Row, Col, Button, Media, Badge, Form, FormGroup, Input, Label, CustomInput} from 'reactstrap';
import Footer from "../Components/Footer";
import StateSelector from "../Components/StateSelector";
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import axios from 'axios';
import CategoryDropdown from '../Components/CategoryDropdown';
import { DateTimePicker } from 'react-rainbow-components';
import { create } from 'domain';
{/* import { GoogleAddressLookup } from 'react-rainbow-components'; REQUIRES GOOGLE MAPS API KEY */}

{/* Not sure if this stuff is right */}
type taskState = {
    categoryId: number,
    title: string,
    description: string,
    recommendedPrice: number | undefined,
    estimatedDurationMinutes: number | undefined,
    locationALongitude: number,
    locationALatitude: number,
    locationBLongitude: number,
    locationBLatitude: number
}

{/* NOTE: might need leaflet-control-geocoder for geocoding/reverse addresses and coordinates */}

const taskFields = {
    // TODO: associate categories with their respective category ID's
    // Default initial values for the task fields
    categoryId: 1,
    title: "",
    description: "",
    recommendedPrice: undefined,
    estimatedDurationMinutes: undefined,
    locationALongitude: 15,
    locationALatitude: 15,
    locationBLongitude: 15,
    locationBLatitude: 15
}

const ListingPage = () => {
    const token = localStorage.getItem('access_token');
    const [task, setTask]  = useState<taskState>(taskFields);

    const createTask = async () => {
        await axios.post('http://127.0.0.1:5000/task/createTask', task,
        { 
            headers: { Authorization: `Bearer ${token}` }
        })
        .then( response => {
            console.log(response.data);
            // createTask(response.data)
        })
        .catch( error => {
            console.log(error);
        });   
    }
    
    const inputStyles = {
        maxWidth: 320,
    }
    
    // Update: Steven J.
    // I leaned away from useEffect() since it runs when the component renders
    // and doesn't allow the page to create tasks for some reason

    // useEffect(()=> {
    //     createTask();
    // }, []);

    return (
        <div>
            <Navigation/>
            <Container onSubmit={createTask}>
                <h1 id="centered" style={{ fontWeight: 'bold' }}>List a new Task</h1>
                <br/>

                <div className="centered">
                    <Form>
                        {/* Row 1 - Name & Category */}
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="taskTitle"><h4>Task Title</h4></Label>
                                    <Input type="text" name="taskTitle" id="taskTitle" placeholder="Lawn Mowing" value={task.title} onChange={e => setTask({...task, title: e.target.value})} required/>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="taskCategory"><h4>Task Category</h4></Label>
                                    {/* <Input type="select" name="taskCategory" id="taskCategory" value={task?.categoryId} required> */}
                                    <Input type="select" name="taskCategory" id="taskCategory" value={1} required>
                                        {/* TODO: Change hardcoded category id to their respective ids */}
                                        <option selected disabled>Select Category</option>
                                        <option>Test</option>
                                        <CategoryDropdown categoryList={['SAMPLE USAGE','Educational','Fitness','IMPORT OTHERS FROM FULL LIST']} />
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>

                        {/* Row 2 - Description & Tools */}
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="taskDesc"><h4>Task Description</h4></Label>
                                    <Input type="textarea" name="taskDesc" id="taskDesc" placeholder="Description" value={task.description} onChange={e => setTask({...task, description: e.target.value})} required/>
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
                                    <Input type="number" 
                                           name="taskPayRate" 
                                           id="taskPayRate" 
                                           placeholder="60" 
                                           min="15" 
                                           value={task.recommendedPrice} 
                                           onChange={e => setTask({...task, recommendedPrice: Number(e.target.value)})} required/>
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

                        {/* Row 3.5 - DateTimePicker & Extra */}
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="DateTime"><h4>Date & Time</h4></Label>
                                    <DateTimePicker
                                        formatStyle="large"
                                        name="DateTime"
                                        value={Date()}
                                        className="rainbow-m-around_small"
                                        required
                                    />
                                </FormGroup>
                                {/* REMOVED FROM DateTimePicker
                                    label="DateTimePicker Label"
                                    value={state.value} 
                                    onChange={value => setState({ value })} 
                                */}
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="Duration"><h4>Duration in Minutes</h4></Label>
                                    <Input type="text" 
                                           name="duration"
                                           id="duration" 
                                           placeholder="60" 
                                           value={task.estimatedDurationMinutes} 
                                           onChange={e => setTask({...task, estimatedDurationMinutes: Number(e.target.value)})} required/>
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

                        <div className="centered"><Button color="primary" size="lg" type="submit">List Task</Button></div>

                    </Form>
                </div>

            </Container>
            <br />
            <Footer/>
        </div>
    );
}

export default ListingPage;