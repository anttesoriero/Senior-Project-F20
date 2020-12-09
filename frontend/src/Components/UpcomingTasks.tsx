import { SlowBuffer } from 'buffer'
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, ButtonGroup, PopoverBody, UncontrolledPopover, FormGroup, Input, Label, InputGroup, InputGroupAddon } from 'reactstrap';
import axios from 'axios';
import APIContext from '../Contexts/APIContext';import OfferCard from './OfferCard';
;

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

const UpcomingTask = () => {
    const token = localStorage.getItem('access_token');
    const url = useContext(APIContext);

    let a: task[] = [];
    let b: offer[][] = [];

    const [tasks, setTasks] = useState(a);
    const [offers, setOffers] = useState(b);
    
    const getUpcomingTasks = async () => {
        await axios.get(url + 'me/getMyOffers',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                response.data.map(task => {
                    setTasks(oldArray => [...oldArray, task.task])
                    setOffers(old => [...old, task.myOffers])

                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        getUpcomingTasks()
    }, [])

    return(
        <div>
            {tasks?.map(task => (
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
            ))}
        </div>
    )
}

export default UpcomingTask;