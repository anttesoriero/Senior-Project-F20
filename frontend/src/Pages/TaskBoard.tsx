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

type location = {
    local: LatLngTuple
}

const TaskBoard = () => {
    const url = useContext(APIContext);
    const token = localStorage.getItem('access_token');

    let a: task[] = [];

    const [tasks, setTasks] = useState(a);
    const [centerLocation, setCenterLocation] = useState<LatLngTuple>();
    /* const [task, getTaskList] = useState<taskIDState>(taskIDs); ERRORS */
    const center: LatLngTuple = [0, 0]


    const getTaskList = async () => {
        await axios.get(url + 'task/recommendTasks',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
                setTasks(response.data.tasks);
                setCenterLocation([(response.data.query.location.within[1] + response.data.query.location.within[0]) / 2
                                    , (response.data.query.location.within[2] + response.data.query.location.within[3]) / 2])
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

    
    

    return (
        <div>
            <Navigation />

            {/* Search Bar */}
            <RefineSearch className="centered" />

            <Row>
                {/* Left - TaskCards */}
                <Col xs="3" className="col-scroll">
                    <Container>
                        <h3 id="top" className="centered" style={{fontWeight: 'bolder'}}>Tasks</h3>
                        <hr/>
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

                        <hr/> 
                        <h4 className="centered" style={{fontWeight: 'bolder'}}>No More Tasks in this Area</h4>&nbsp;
                        <Button className={'task centered'} href="#top">Back to Top</Button>

                        <br />
                        <div className='centered'>
                            <PaginationRow />
                        </div>

                    </Container>

                </Col>

                <Col xs="9">
                    <MapContainer className="leaflet-container" center={centerLocation ? centerLocation : center} zoom={5} scrollWheelZoom={true} >
                        {/* Need to change "center" to users location - center{[userLat, userLong]} */}

                        <TileLayer
                            url="https://api.mapbox.com/styles/v1/sanchezer1757/cki7qwrxp2vlt1arsifbfcccx/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2FuY2hlemVyMTc1NyIsImEiOiJja2k3cXUzbzExbDNtMnRxc2NlZnFnenJ2In0.zCSSQC8m87qtzSpfQS7Y8A" 
                            attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
                        />

                        {/* Map Circle Markers - MapsCircle */}
                        {tasks.map(task => (
                            <MapsCircle
                                key={task.taskId}
                                title={task.title}
                                categoryId={task.categoryId}
                                amount={Number(task.recommendedPrice)}
                                duration={task.estimatedDurationMinutes}
                                latitude={Number(task.locationALatitude)}
                                longitute={Number(task.locationALongitude)} />
                        ))}

                    </MapContainer>
                </Col>
            </Row>
            <Footer />
        </div>
    );
}

export default TaskBoard;