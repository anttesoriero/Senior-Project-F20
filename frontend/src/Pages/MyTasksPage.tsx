import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'reactstrap';
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
            includeArchived: false
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
                            <br />
                            {offers ? tasks.map(task => (
                                <div>
                                    <h5>{task.title} {/* &#9655; */}</h5>
                                    
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
                                </div>
                                
                            )): <div>No Offers</div>}
                        </div>)

                    case 'upcoming':
                        return (<div>
                            <h2><u>Upcoming tasks</u></h2>
                            <h4>Upcoming Tasks page should have a map with precise location markers. 2 Options:</h4>
                            <ol>
                                <li>We could have one big map like the Task Board with multiple markers, and a popup for each marker on click</li>
                                <li>We could have one small map per task, and each task gets its own row. Task info on the left, map on the right</li>
                            </ol>
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