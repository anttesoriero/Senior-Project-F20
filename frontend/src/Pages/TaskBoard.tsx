import React, { useEffect, useState, useContext } from 'react';
import Navigation from '../Components/Navigation';
import { Button, Col, Container, Row } from 'reactstrap';
import Footer from "../Components/Footer";
import axios from 'axios';
import TaskCard from '../Components/TaskCard';
import RefineSearch from '../Components/RefineSearch';
import PaginationRow from '../Components/PaginationRow';
import { TileLayer, MapContainer } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import MapsCircle from '../Components/MapsCircle';
import APIContext from '../Contexts/APIContext';

type task = {
    taskId: number,
    categoryId: number,
    recommendedPrice: string,
    amount: number,
    estimatedDurationMinutes: number,
    locationALatitude: number,
    locationALongitude: number,
    title: string,
    posterTaskId: number,
    description: string
}

const TaskBoard = () => {
    const url = useContext(APIContext);

    const token = localStorage.getItem('access_token');

    let a: task[] = [];
    const [tasks, setTasks] = useState(a);
    /* const [task, getTaskList] = useState<taskIDState>(taskIDs); ERRORS */


    const getTaskList = async () => {
        await axios.get(url + 'task/recommendTasks',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data.tasks);
                setTasks(response.data.tasks);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const getIds = async () => {
        await axios.get(url + 'task/getPublic',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        getTaskList();
        //getIds();
    }, []);

    const centerLocation: LatLngTuple = [39.7089, -75.1183]
    const sample: LatLngTuple = [39.7051596, -75.11357028778912]

    return (
        <div>
            <Navigation />

            {/* Search Bar */}
            <RefineSearch className="centered" />

            <Row>
                {/* Left - TaskCards */}
                <Col xs="4" className="col-scroll">
                    <Container>
                        <h3 id="top" className="centered">Tasks</h3>
                        {tasks.map(task => (
                            <TaskCard
                                key={task.taskId}
                                id={task.taskId}
                                title={task.title}
                                offerer={task.posterTaskId}
                                price={Number(task.recommendedPrice)}
                                description={task.description}
                                duration={task.estimatedDurationMinutes}
                            />
                        ))}

                        <h4 className="centered">No More Tasks in this Area</h4>
                        <Button className={'task centered'} href="#top">Back to Top</Button>

                        <br />
                        <div className='centered'>
                            <PaginationRow />
                        </div>

                    </Container>

                </Col>

                <Col xs="8">
                    <MapContainer className="leaflet-container" center={centerLocation} zoom={15} scrollWheelZoom={true} >
                        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* Map Circle Markers - MapsCircle */}
                        {tasks.map(task => (
                            <MapsCircle
                                key={task.taskId}
                                title={task.title}
                                categoryId={task.categoryId}
                                amount={Number(task.recommendedPrice)}
                                duration={task.estimatedDurationMinutes}
                                latitude={39.7089}
                                longitute={-75.1183} />
                        ))}

                    </MapContainer>
                </Col>
            </Row>
            <Footer />

        </div>
    );
}

export default TaskBoard;