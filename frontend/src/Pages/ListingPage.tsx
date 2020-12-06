import React, { useState, useContext, useEffect, useRef } from 'react';
import Navigation from '../Components/Navigation';
import { Container, Row, Col, Button, FormGroup, Input, Label, InputGroup, InputGroupAddon } from 'reactstrap';
import Footer from "../Components/Footer";
import StateSelector from "../Components/StateSelector";
import axios from 'axios';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import APIContext from '../Contexts/APIContext';

type taskState = {
    categoryId: number,
    title: string,
    description: string,
    recommendedPrice: number,
    estimatedDurationMinutes: number,
    locationALongitude: number,
    locationALatitude: number,
    startDate: string
    // locationBLongitude: number,
    // locationBLatitude: number
}

const taskFields = {
    // Default initial values for the task fields
    categoryId: 1,
    title: "",
    description: "",
    recommendedPrice: 0,
    estimatedDurationMinutes: 0,
    locationALongitude: 0,
    locationALatitude: 0,
    startDate: ""
    // locationBLongitude: 15,
    // locationBLatitude: 15
}

const ListingPage = ({ history }: RouteComponentProps) => {
    const token = localStorage.getItem('access_token');
    const url = useContext(APIContext);
    const [taskInfo, setTaskInfo] = useState<taskState>(taskFields);
    const [serror, setSerror] = useState<boolean>(false);
    const isInitialMount = useRef(true)

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
        }
        else {
            createTask()
        }
    })

    const createTask = async () => {
        console.log('Info: ', taskInfo)

        await axios.post(url + 'task/createTask', {
            categoryId: taskInfo?.categoryId - 1,
            title: taskInfo?.title,
            description: taskInfo?.description,
            recommendedPrice: taskInfo?.recommendedPrice,
            estimatedDurationMinutes: taskInfo?.estimatedDurationMinutes,
            locationALatitude: taskInfo?.locationALatitude,
            locationALongitude: taskInfo?.locationALongitude,
            startDate: taskInfo?.startDate
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

    const geocode = async (data) => {
        var location = data.address + data.address2 + data.city + data.state + data.zip;
        console.log('data: ', data)
        await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: location,
                key: 'AIzaSyAqavh6zA4RtzZud6DohqzFjdJscxQ_Hk4'
            }
        })
        .then(function(response){
			console.log(response)
			
			const results = response.data.results
			if (results !== undefined && results.length !== 0) {
				const { lat, lng } = results[0].geometry.location
             
				setTaskInfo({
                    categoryId: data.categoryId,
                    title: data.title,
                    description: data.description,
                    recommendedPrice: data.recommendedPrice,
                    estimatedDurationMinutes: data.estimatedDurationMinutes,
                    locationALongitude: lng,
                    locationALatitude: lat,
                    startDate: data.date + ' ' + data.time
                })
            }
			else {
				throw String("That address doesn't exist!")
			}
        })
    } 

    return (
        <div>
            <Navigation />
            <Container>
                <h1 id="centered" style={{ fontWeight: 'bold' }}>List a new Task</h1>
                <br />

                <div className="centered">
                    <Formik initialValues={{ categoryId: 1, title: '', description: '', recommendedPrice: 0, estimatedDurationMinutes: 60 }} onSubmit={data => geocode(data)} >
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
                                        <Field type="select" name="categoryId" as={Input} required>
                                            {/* "Select Category" is value=1 because "Yard Work" 
                                                keeps displaying first even though it's second.
                                                When calling the endpoint, the categoryId is substracted by one. */}
                                            <option value="1" disabled>Select Category</option>
                                            <option value="2">Yard Work</option>
                                            <option value="3">Transportation</option>
                                            <option value="4">Cleaning</option>
                                            <option value="5">Moving</option>
                                            <option value="6">Care-Taking</option>
                                            <option value="7">Cooking</option>
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
                                        <Field type="date" name="date" id="date" placeholder="MM-DD-YYYY" as={Input} required />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="time"><h4>Time *</h4></Label>
                                        <Field type="time" name="time" id="time" placeholder="HH:MM PM" as={Input} required />
                                    </FormGroup>
                                </Col>
                            </Row>

                            {/* Row 3.5 - DateTimePicker & Extra */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="estimatedDurationMinutes"><h4>Duration in Minutes *</h4></Label>
                                        <Field type="number" name="estimatedDurationMinutes" id="estimatedDurationMinutes" placeholder="Minutes" min="15" as={Input} required />
                                    </FormGroup>
                                </Col>
                            </Row>

                            {/* Row 4 - Address 1 & Address 2 */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="address"><h4>Address *</h4></Label>
                                        <Field type="text" name="address" id="address" placeholder="Address" as={Input} required />
                                    </FormGroup>
                                </Col>
                            </Row>

                            {/* Row 5 - City - State - Zip */}
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="city"><h4>City *</h4></Label>
                                        <Field type="text" name="city" id="city" placeholder="City" as={Input} required />
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
                                        <Field type="text" name="zip" id="zip" placeholder="Zipcode" as={Input} required />
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