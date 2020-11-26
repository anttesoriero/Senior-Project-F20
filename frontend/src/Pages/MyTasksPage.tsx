import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, UncontrolledCollapse, Button, ButtonGroup } from 'reactstrap';
import APIContext from '../Contexts/APIContext';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import axios from 'axios';
import OfferCard from '../Components/OfferCard';

type task = {
    accepted: boolean,
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

const MyTasksPage = () => {
    const token = localStorage.getItem('access_token');
    const url = useContext(APIContext);

    let a: task[] = [];
    let b: offer[][] = [];
    const [tasks, setTasks] = useState(a);
    const [offers, setOffers] = useState(b);

    const getTaskIds = async () => {
        await axios.get(url + 'me/getPostedTasks',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data.tasks)
                setTasks(response.data.tasks)
                let i = 0;
                response.data.tasks.map(task => (
                    getOffers(response.data.tasks[i].taskId),
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
            includeArchived: true
        },
        { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data.offers)
                setOffers(oldArray => [...oldArray, response.data.offers])
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        getTaskIds();
    }, [])

    const [pageState, setPageState] = useState<String>("offers")

    const toOffers = () => {
        setPageState("offers")
    }

    const toUpcoming = () => {
        setPageState("upcoming")
    }

    return (
        <div>
            <Navigation />
            <Container>
            <h1 className="centered">My Tasks</h1>
            <ButtonGroup className="centered">
                <Button onClick={toOffers}>Offers</Button>
                <Button onClick={toUpcoming}>Upcoming Tasks</Button>
            </ButtonGroup>
            
            {(() => {
                switch (pageState) {
                    case 'offers':
                        return (<div>
                            <h2><u>Offers</u></h2>
                            {/* NOTE: Commented Styling - Could collapse each task section if wanted */}
                            {/* <h5>Click Task to Show Offers</h5> */}
                            <br />
                            {tasks.map(task => (
                                <div>
                                    
                                    {/* Task Title & Toggle */}
                                    <Row>
                                        <Col xs="auto"><h5 id={"toggler" + task.taskId}>{task.title} {/* &#9655; */}</h5></Col>
                                        {/* <Col><Button color="primary" id={"toggler" + task.taskId} size="sm" style={{ marginBottom: '1rem' }}>Toggle</Button></Col> */}
                                    </Row>
                                    
                                    
                                    {/* <UncontrolledCollapse toggler={"#toggler" + task.taskId}> */}
                                    <ul>
                                        {offers?.map(offer => (
                                            <Row>
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
                                    {/* </UncontrolledCollapse> */}
                                </div>
                                
                            ))}
                        </div>)

                    case 'upcoming':
                        return (<div>
                            <h2><u>Upcoming tasks</u></h2>
                            <br />
                        </div>)

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