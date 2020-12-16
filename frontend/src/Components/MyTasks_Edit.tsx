import React, { useState, useContext } from 'react'
import axios from 'axios';
import { Container, Row, Col, FormGroup, Label, Input, InputGroup, InputGroupAddon, Button } from 'reactstrap';
import APIContext from '../Contexts/APIContext';
import { Formik, Form, Field } from 'formik';


type taskState = {
    categoryId: number,
    title: string,
    description: string,
    recommendedPrice: number,
    estimatedDurationMinutes: number,
    locationALongitude: number,
    locationALatitude: number,
    startDate: string
}

type MyTasksEditProps = {
    taskInfo: taskState,
    editTaskId: number | undefined,
    toOffers: Function,
    getTaskIds: Function
}

const MyTasks_Edit = ({toOffers, getTaskIds, editTaskId, taskInfo}: MyTasksEditProps) => {
    const token = localStorage.getItem('access_token');
    const url = useContext(APIContext);

    const [serror, setSerror] = useState<boolean>(false);

    const editTask = async (taskData) => {

        await axios.patch(url + 'task/editTask', {
            taskId: editTaskId,
            categoryId: taskData.categoryId,
            title: taskData.title,
            description: taskData.description,
            recommendedPrice: taskData.recommendedPrice,
            estimatedDurationMinutes: taskData.estimatedDurationMinutes,
            locationALatitude: taskData.locationALatitude,
            locationALongitude: taskData.locationALongitude,
            startDate: taskData.startDate
        },
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                toOffers()
                getTaskIds()
            })
            .catch(error => {
                console.log(error);
                setSerror(true);
            });
    }
    
    const geocode = async (data) => {
        console.log('data: ', data)
        localStorage.setItem('title', data.title)
        var location = data.address + data.city + data.state + data.zip;
        await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: location,
                key: 'AIzaSyAqavh6zA4RtzZud6DohqzFjdJscxQ_Hk4'
            }
        })
        .then(function(response) {
			const results = response.data.results
			if (results !== undefined && results.length !== 0) {
                const { lat, lng } = results[0].geometry.location
                
                const taskData = {
                    categoryId: data.categoryId,
                    title: data.title,
                    description: data.description,
                    recommendedPrice: data.recommendedPrice,
                    estimatedDurationMinutes: data.estimatedDurationMinutes,
                    locationALongitude: lng,
                    locationALatitude: lat,
                    startDate: data.date + ' ' + data.time
                }
                

                editTask(taskData)
            }
			else {
				throw String("That address doesn't exist!")
			}
        })
    } 

    const dateTime = (dateTime) => {
        const date = new Date(dateTime).toISOString()
        return [date.substring(0, 10), date.substring(11, 16)]
    }

    const date = dateTime(taskInfo.startDate)[0]
    const time = dateTime(taskInfo.startDate)[1]

    return(
        <Container>
            {console.log(editTaskId)}
            <div className="centered">
                <Formik initialValues={{ 
                        categoryId: taskInfo.categoryId, 
                        title: taskInfo.title, 
                        description: taskInfo.description, 
                        recommendedPrice: taskInfo.recommendedPrice, 
                        estimatedDurationMinutes: taskInfo.estimatedDurationMinutes,
                        date: date,
                        time: time
                    }} onSubmit={data => geocode(data)}>
                    {() => (
                        <Form>
                            {/* Row 1 - Name & Category */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="title"><h4>Task Title *</h4></Label>
                                        <Field type="text" name="title" placeholder={taskInfo.title} as={Input} required />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="categoryId"><h4>Task Category *</h4></Label>
                                        <Field type="select" name="categoryId" as={Input} selected={taskInfo.categoryId} required>
                                            <option value="0" disabled>Select Category</option>
                                            <option value="1">Yard Work</option>
                                            <option value="2">Transportation</option>
                                            <option value="3">Cleaning</option>
                                            <option value="4">Moving</option>
                                            <option value="5">Care-Taking</option>
                                            <option value="6">Cooking</option>
                                            <option value="7">Other</option>
                                        </Field>
                                    </FormGroup>
                                </Col>
                            </Row>
                            {/* Row 2 - Description & Pay Rate */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="description"><h4>Task Description</h4></Label>
                                        <Field type="textarea" name="description" placeholder={taskInfo.description} as={Input} />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <Label className="centered" for="recommendedPrice"><h4>Pay Rate *</h4></Label>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                                        <Field type="number" name="recommendedPrice" placeholder={taskInfo.recommendedPrice} min="15" max="1000" as={Input} required />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <hr />
                            {/* Row 3 - Date & Time */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="date"><h4>Date *</h4></Label>
                                        <Field type="date" name="date" id="date" placeholder={date} as={Input} required />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="time"><h4>Time *</h4></Label>
                                        <Field type="time" name="time" id="time" placeholder={time} as={Input} required />
                                    </FormGroup>
                                </Col>
                            </Row>
                            {/* Row 4 - DateTimePicker & Extra */}
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="estimatedDurationMinutes"><h4>Duration in Minutes *</h4></Label>
                                        <Field type="number" name="estimatedDurationMinutes" id="estimatedDurationMinutes" placeholder={taskInfo.estimatedDurationMinutes} min="15" max="720" as={Input} required />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <div className='centered'>
                                <p>* are required fields</p> <br />
                            </div>
                            <div className='centered'>
                                {serror ? <p className='error'>There was an error submitting the task!</p> : <div></div>}
                            </div>
                            {/* Bottom Buttons */}
                            <Row className='centered'>
                                <div className="centered"><Button color="primary" size="md" type="submit" >Save Changes</Button></div>
                                &nbsp;&nbsp;
                                <div className="centered"><Button color="secondary" size="md" type="button" onClick={() => toOffers()}>Cancel</Button></div>
                            </Row>
                        </Form>
                    )}
                </Formik>
            </div>
            <br />
        </Container>
    )
}

export default MyTasks_Edit;