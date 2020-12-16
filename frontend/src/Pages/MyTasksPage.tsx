import React, { useState, useEffect, useContext } from 'react';
import { Container, Button, ButtonGroup } from 'reactstrap';
import APIContext from '../Contexts/APIContext';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import axios from 'axios';
import UpcomingTask from '../Components/UpcomingTasks';
import MyTasks_Offers from '../Components/MyTasks_Offers';
import MyTasks_Edit from '../Components/MyTasks_Edit';

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
}


const MyTasksPage = () => {
    const token = localStorage.getItem('access_token');
    const url = useContext(APIContext);

    let a: task[] = [];
    let b: offer[][] = [];
    let c: task[] = [];

    const [tasks, setTasks] = useState(a);
    const [offers, setOffers] = useState(b);
    const [pageState, setPageState] = useState<String>("offers")
    // Task state when user edits task
    const [taskInfo, setTaskInfo] = useState<taskState>(taskFields);
    // The id of the task that is currently being edited
    const [editTaskId, setEditTaskId] = useState<number>();

    const toOffers = () => {
        setPageState("offers")
    }

    const toUpcoming = () => {
        setPageState("upcoming")
    }

    const getTaskIds = async () => {
        await axios.get(url + 'me/getPostedTasks',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                const responseData = response.data.tasks
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
                setOffers(oldArray => [...oldArray, response.data.offers])
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        getTaskIds()
    }, [])

    return (
        <div>
            <Navigation />
            <Container>
                {pageState !== "editTask" ?
                <div>
                    <h1 className="centered">My Tasks</h1>
                    <br/>
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
                            return (<MyTasks_Offers tasks={tasks} offers={offers} setPageState={setPageState} setEditTaskId={setEditTaskId} setTaskInfo={setTaskInfo} />)
                        case 'upcoming':
                            return (<UpcomingTask/>)
                        case 'editTask':
                            return (<MyTasks_Edit toOffers={toOffers} getTaskIds={getTaskIds} taskInfo={taskInfo} editTaskId={editTaskId} />)
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