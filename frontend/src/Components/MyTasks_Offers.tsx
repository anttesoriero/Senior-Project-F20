import React, { useContext, useState } from 'react';
import OfferCard from '../Components/OfferCard';
import { Row, Col, Button, UncontrolledPopover, PopoverBody } from 'reactstrap';
import APIContext from '../Contexts/APIContext';
import axios from 'axios';

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

type MyTasksOffersProps = {
    tasks : task[],
    offers: offer[][],
    setPageState: Function,
    setEditTaskId: Function,
    setTaskInfo: Function
}

const MyTasks_Offers = ({tasks, offers, setPageState, setEditTaskId, setTaskInfo} : MyTasksOffersProps) => {
    const token = localStorage.getItem('access_token');
    const url = useContext(APIContext);
    
    const deleteTask = async (id) => {
        await axios.delete(url + 'task/deleteTask?taskId=' + id, {
            headers: { Authorization: `Bearer ${token}` 
        }})
            .then(response => {
                window.location.reload(false);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const toEditTask = async (id) => {
        setEditTaskId(id)
        await axios.get(url + 'task/getPublic?taskId=' + id,
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setTaskInfo(response.data)
            })
            .catch(error => {
                console.log(error)
            })
        setPageState("editTask")
    }

    return(
        <div>
            <br />
            {tasks.length === 0 ? <div className={'centered'}><h2>No Tasks Posted Yet</h2></div> : <div></div>}
            {offers 
                ? tasks.map(task => (
                    <div key={task.taskId}>
                        <Row>
                            <Col xs="auto"><h5>{task.title}</h5><hr/></Col>
                            {!task.accepted ? 
                                <Col xs="auto">
                                    <Button color="info" size="sm" id="editTask" type="button" onClick={() => toEditTask(task.taskId)} outline>Edit</Button>&nbsp;&nbsp;
                                    <Button color="danger" size="sm" id="confirmDelete" type="button" outline>Delete</Button>
                                    <UncontrolledPopover style={{padding: 10}} placement="bottom" target="confirmDelete">
                                        <h3>Are you sure?</h3>
                                        <PopoverBody>This cannot be undone</PopoverBody>
                                        <Button color="danger" size="sm" type="submit" onClick={() => deleteTask(task.taskId)}>Confirm</Button>
                                        <br />
                                    </UncontrolledPopover>
                                </Col>                                                
                                :
                                <div></div>
                            }
                        </Row>
                        <div>
                            {offers?.map(offer => (
                                <Row>
                                    {offer.map(single => (
                                        single.taskId === task.taskId 
                                            ?
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
                        </div>
                    </div>
                    )) 
                : <div></div>}
        </div>
    )
}

export default MyTasks_Offers;