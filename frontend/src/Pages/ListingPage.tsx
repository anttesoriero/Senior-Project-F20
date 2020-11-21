import React, { useState, useContext } from 'react';
import Navigation from '../Components/Navigation';
import { Container, Row, Col, Button, FormGroup, Input, Label, InputGroup, InputGroupAddon } from 'reactstrap';
import Footer from "../Components/Footer";
import StateSelector from "../Components/StateSelector";
import axios from 'axios';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import APIContext from '../Contexts/APIContext';

{/* import { GoogleAddressLookup } from 'react-rainbow-components'; REQUIRES GOOGLE MAPS API KEY */ }

{/* Not sure if this stuff is right */ }
type taskState = {
    categoryId: number,
    title: string,
    description: string,
    recommendedPrice: number,
    estimatedDurationMinutes: number,
    locationALongitude: number,
    locationALatitude: number,
    locationBLongitude: number,
    locationBLatitude: number
}

{/* NOTE: might need leaflet-control-geocoder for geocoding/reverse addresses and coordinates */ }

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

const ListingPage = ({ history }: RouteComponentProps) => {
    const token = localStorage.getItem('access_token');
    const url = useContext(APIContext);

    const [serror, setSerror] = useState(false);

    const createTask = async (data) => {
        console.log(data)
        await axios.post(url + 'task/createTask', {
            categoryId: data.categoryId,
            title: data.title,
            description: data.description,
            recommendedPrice: data.recommendedPrice,
            estimatedDurationMinutes: data.estimatedDurationMinutes,
            locationALatitude: 39.7089,
            locationALongitude: -75.1183
        },
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                console.log(response.data);
                history.push('/')
            })
            .catch(error => {
                console.log(error);
                setSerror(true);
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
            <Navigation />
            <Container>
                <h1 id="centered" style={{ fontWeight: 'bold' }}>List a new Task</h1>
                <br />

                <div className="centered">
                    <Formik initialValues={{ categoryId: 1, title: '', description: '', recommendedPrice: 0, estimatedDurationMinutes: 60 }} onSubmit={data => createTask(data)} >
                        <Form>
                            {/* Row 1 - Name & Category */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="title"><h4>Task Title *</h4></Label>
                                        <Field type="text" name="title" placeholder="Title" as={Input} required />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="categoryId"><h4>Task Category *</h4></Label>
                                        {/* <Input type="select" name="taskCategory" id="taskCategory" value={task?.categoryId} required> */}
                                        <Field type="select" name="categoryId" value={1} as={Input} required>
                                            {/* TODO: Change hardcoded category id to their respective ids */}
                                            <option selected disabled>Select Category</option>
                                            <option>Test</option>
                                        </Field>
                                    </FormGroup>
                                </Col>
                            </Row>

                            {/* Row 2 - Description & Pay Rate */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="taskDesc"><h4>Task Description</h4></Label>
                                        <Field type="textarea" name="description" placeholder="Description" as={Input} />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <Label className="centered" for="recommendedPrice"><h4>Pay Rate *</h4></Label>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                                        <Field type="number" name="recommendedPrice" placeholder="60" min="15" as={Input} required />
                                        <InputGroupAddon addonType="append">.00</InputGroupAddon>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <hr />

                            {/* Row 3 - Date & Time */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="date"><h4>Date *</h4></Label>
                                        <Field type="date" name="date" id="date" placeholder="01-20-2021" as={Input} required />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="time"><h4>Time *</h4></Label>
                                        <Field type="time" name="time" id="time" placeholder="12:00PM" as={Input} required />
                                    </FormGroup>
                                </Col>
                            </Row>

                            {/* Row 3.5 - DateTimePicker & Extra */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="estimatedDurationMinutes"><h4>Duration in Minutes *</h4></Label>
                                        <Input type="text" name="estimatedDurationMinutes" placeholder="60" as={Input} required />
                                    </FormGroup>
                                </Col>
                            </Row>

                            {/* Row 4 - Address 1 & Address 2 */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="address"><h4>Address *</h4></Label>
                                        <Field type="text" name="address" id="address" placeholder="123 Main St" as={Input} required />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="address2"><h4>Address 2</h4></Label>
                                        <Field type="text" name="address2" id="address2" placeholder="Apartment, studio, floor, etc." as={Input} />
                                    </FormGroup>
                                </Col>
                            </Row>

                            {/* Row 5 - City - State - Zip */}
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="city"><h4>City *</h4></Label>
                                        <Field type="text" name="city" id="city" placeholder="Glassboro" as={Input} required />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="state"><h4>State *</h4></Label>
                                        <StateSelector />
                                    </FormGroup>
                                </Col>
                                <Col md="2">
                                    <FormGroup>
                                        <Label for="zip"><h4>Zip *</h4></Label>
                                        <Field type="text" name="zip" id="zip" placeholder="08028" as={Input} required />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <div className='centered'>

                                <p>* are required fields</p> <br />
                            </div>
                            <div className='centered'>
                                {serror ? <p className='error'>There was an error submitting the task!</p> : <div></div>}
                            </div>
                            <div className="centered">
                                <Button color="primary" size="lg" type="submit">List Task</Button>
                            </div>

                        </Form>
                    </Formik>
                </div>

            </Container>
            <br />
            <Footer />
        </div >
    );
}

export default withRouter(ListingPage);