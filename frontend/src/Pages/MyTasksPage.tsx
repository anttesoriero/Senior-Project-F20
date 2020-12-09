import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, ButtonGroup, PopoverBody, UncontrolledPopover, FormGroup, Input, Label, InputGroup, InputGroupAddon } from 'reactstrap';
import APIContext from '../Contexts/APIContext';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import axios from 'axios';
import OfferCard from '../Components/OfferCard';
import { Formik, Form, Field } from 'formik';
import StateSelector from '../Components/StateSelector';
import UpcomingTask from '../Components/UpcomingTasks';

type task = {
    accepted: boolean,
    completed: boolean,
    categoryId: number,
    description: string,
    estimatedDurationMinutes: number,
    locationALatitude: string,
    locationALongitude: string,
    locationBLatitude: null,
    locationBLongitude: null,
    posterTaskId: number,
    recommendedPrice: string,
    taskId: number,
    title: string
}

type offer = {
    accepted: boolean,
    archived: boolean,
    jobDurationMinutes: number,
    note: string,
    offerId: number,
    payment: number,
    responseMessage: null,
    startDate: string,
    taskId: number,
    userIdFrom: number
}

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
    categoryId: 0,
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

const MyTasksPage = () => {
    const token = localStorage.getItem('access_token');
    const url = useContext(APIContext);

    let a: task[] = [];
    let b: offer[][] = [];
    let c: task[] = [];

    const [tasks, setTasks] = useState(a);
    const [offers, setOffers] = useState(b);
    const [upcomingTasks, setUpcomingTasks] = useState(c);
    // Task state when user edits task
    const [taskInfo, setTaskInfo] = useState<taskState>(taskFields);
    // The id of the task that is currently being edited
    const [editTaskId, setEditTaskId] = useState<number>();
    const [serror, setSerror] = useState<boolean>(false);

    const getTaskIds = async () => {
        await axios.get(url + 'me/getPostedTasks',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                const responseData = response.data.tasks
                //console.log(responseData)
                setTasks(responseData)

                let i = 0;
                responseData?.map(task => (
                    getOffers(responseData[i].taskId),
                    i++
                ))
            })
            .catch(error => {
                console.log(error)
            })
    }

    const getOffers = async (id) => {
        await axios.post(url + 'offer/getOffers', {
            taskId: id as number,
            includeArchived: false
        },
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                //console.log(response.data.offers)
                setOffers(oldArray => [...oldArray, response.data.offers])
            })
            .catch(error => {
                console.log(error)
            })
    }

    const deleteTask = async (id) => {
        await axios.delete(url + 'task/deleteTask?taskId=' + id, {
            headers: { Authorization: `Bearer ${token}` 
        }})
            .then(response => {
                //console.log(response.data);
                window.location.reload(false);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const editTask = async () => {
        await axios.patch(url + 'task/updateTask', {
            taskId: editTaskId,
            categoryId: taskInfo?.categoryId,
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
                //console.log(response.data);
                toOffers()
            })
            .catch(error => {
                console.log(error);
                setSerror(true);
            });
    }

    const geocode = async (data) => {
        var location = data.address + data.city + data.state + data.zip;
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
                editTask()
            }
			else {
				throw String("That address doesn't exist!")
			}
        })
    } 

    useEffect(() => {
        getTaskIds()
    }, [])

    const [pageState, setPageState] = useState<String>("offers")

    const toOffers = () => {
        setPageState("offers")
    }

    const toUpcoming = () => {
        setPageState("upcoming")
    }

    const toEditTask = async (id) => {
        setEditTaskId(id)
        await axios.get(url + 'task/getPublic?taskId=' + id,
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data)
                setTaskInfo(response.data)
            })
            .catch(error => {
                console.log(error)
            })
        setPageState("editTask")
    }

    const dateTime = (dateTime) => {
        const date = new Date(dateTime).toISOString()
        return [date.substring(0, 10), date.substring(11, 16)]
    }

    return (
        <div>
            <Navigation />
            <Container>
                {pageState !== "editTask" ?
                <div>
                    <h1 className="centered">My Tasks</h1>
                    {pageState === "offers" ?
                    <ButtonGroup className="centered">
                        <Button onClick={toOffers} active>Posted Tasks</Button>
                        <Button onClick={toUpcoming}>Upcoming Tasks</Button>
                    </ButtonGroup>
                    :
                    <ButtonGroup className="centered">
                        <Button onClick={toOffers}>Posted Tasks</Button>
                        <Button onClick={toUpcoming} active>Upcoming Tasks</Button>
                    </ButtonGroup>}
                </div>
                :
                <div>
                    <h1 className="centered">Edit Task</h1>
                </div>
                }

                {(() => {
                    switch (pageState) {
                        case 'offers':
                            return (<div>
                                {/* <h2><u>Offers</u></h2> */}
                                <br />
                                {tasks.length === 0 ? <div><h2>No Tasks Posted Yet</h2></div> : <div></div>}

                                {offers ? tasks.map(task => (
                                    <div>
                                        <Row>
                                            <Col xs="auto"><h5>{task.title}</h5></Col>
                                            <Col xs="auto">
                                                <Button color="info" size="sm" id="editTask" type="button" onClick={() => toEditTask(task.taskId)} outline>Edit</Button>&nbsp;&nbsp;
                                                <Button color="danger" size="sm" id="confirmDelete" type="button" outline>Delete</Button>
                                            </Col>
                                        </Row>

                                        <UncontrolledPopover style={{padding: 10}} placement="bottom" target="confirmDelete">
                                            <h3>Are you sure?</h3>
                                            <PopoverBody>This cannot be undone</PopoverBody>
                                            <Button color="danger" size="sm" type="submit" onClick={() => deleteTask(task.taskId)}>Confirm</Button>
                                            <br />
                                        </UncontrolledPopover>

                                        <ul>
                                            
                                            {offers?.map(offer => (
                                                <Row>
                                                    {offer.length === 0 ? <div>No Offers Yet</div> : <div></div>}
                                                    {offer.map(single => (
                                                        single.taskId === task.taskId ?
                                                            <Col>
                                                                <OfferCard
                                                                    key={single.offerId}
                                                                    accepted={single.accepted}
                                                                    archived={single.archived}
                                                                    jobDurationMinutes={single.jobDurationMinutes}
                                                                    note={single.note}
                                                                    offerId={single.offerId}
                                                                    payment={single.payment}
                                                                    responseMessage={single.responseMessage}
                                                                    startDate={single.startDate}
                                                                    taskId={single.taskId}
                                                                    userIdFrom={single.userIdFrom}
                                                                />
                                                            </Col>
                                                            : <div></div>
                                                    ))}
                                                </Row>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                )) : <div></div>}
                            </div>)

                        case 'upcoming':
                            return (
                                <UpcomingTask/>
                            )

                        case 'editTask':
                            const date = dateTime(taskInfo.startDate)[0]
                            const time = dateTime(taskInfo.startDate)[1]

                            return (
                                <Container>
                                    <div className="centered">
                                        <Formik initialValues={{ 
                                                categoryId: taskInfo.categoryId, 
                                                title: taskInfo.title, 
                                                description: taskInfo.description, 
                                                recommendedPrice: taskInfo.recommendedPrice, 
                                                estimatedDurationMinutes: taskInfo.estimatedDurationMinutes,
                                                date: date,
                                                time: time
                                            }} 
                                            onSubmit={data => geocode(data)} 
                                        >
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
                                                            <Label for="taskDesc"><h4>Task Description</h4></Label>
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

                                                {/* Row 3.5 - DateTimePicker & Extra */}
                                                <Row>
                                                    <Col>
                                                        <FormGroup>
                                                            <Label for="estimatedDurationMinutes"><h4>Duration in Minutes *</h4></Label>
                                                            <Field type="number" name="estimatedDurationMinutes" id="estimatedDurationMinutes" placeholder={taskInfo.estimatedDurationMinutes} min="15" as={Input} required />
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

                                                {/* Bottom Buttons */}
                                                <Row className='centered'>
                                                    <div className="centered"><Button color="primary" size="md" type="submit" >Save Changes</Button></div>
                                                    &nbsp;&nbsp;
                                                    <div className="centered"><Button color="secondary" size="md" type="button" onClick={toOffers}>Cancel</Button></div>
                                                </Row>
                                            </Form>
                                        </Formik>
                                    </div>
                                </Container>
                            )
                        
                            default:
                                return null;
                    }
                })()}




            </Container>
            <Footer />
        </div>
    );
}

export default MyTasksPage;