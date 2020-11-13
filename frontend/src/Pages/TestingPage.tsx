import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import {Button, Card, CardBody, Col, Collapse, Container, Row} from 'reactstrap';
import Footer from "../Components/Footer";
import axios from 'axios';
import Maps from "../Components/Maps";
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import TaskCard from '../Components/TaskCard';
import RefineSearch from '../Components/RefineSearch';
import PaginationRow from '../Components/PaginationRow';
import { TileLayer, Marker, Popup, MapContainer, CircleMarker, Tooltip, Circle } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import MapsCircle from '../Components/MapsCircle';
// import {Map, L} from 'leaflet';
// <script src="holder.js"/>

type task = {
    categoryId: number,
    amount: number,
    duration: number,
    latitude: number,
    longitute: number,
    title: string,
    offerer: string,
    description: string
}

const TestingPage = () => {
    const token = localStorage.getItem('access_token');

    let a: task[] = [];
    const [tasks, setTasks] = useState(a);
    /* const [task, getTaskList] = useState<taskIDState>(taskIDs); ERRORS */


    const getTaskList = async () => {
        await axios.get(`http://ec2-54-165-213-235.compute-1.amazonaws.com:80/task/recommendTasks`,
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
                setTasks(response.data.tasks);
            })
            .catch(error => {
                console.log(error);
            });
    }
    
    const getIds = async () => {
        await axios.get(`http://ec2-54-165-213-235.compute-1.amazonaws.com:80/task/getPublic`,
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
        getIds();
    }, []);

    const centerLocation: LatLngTuple = [39.7089, -75.1183]
    const sample: LatLngTuple = [39.7051596, -75.11357028778912]

    return (
        <div>
            <Navigation/>

            {/* Search Bar */}
            <RefineSearch className="centered"/>

            <Row>
                {/* Left - TaskCards */}
                <Col xs="4" className="col-scroll">
                    <Container>
                            <h3 id="top" className="centered">Tasks</h3>
                            {tasks.map( task => (
                                <TaskCard title={task.title} offerer={task.offerer} price={task.amount} description={task.description}/>
                            ))}

                            <Card>
                                <CardBody>
                                    <h4 className="centered">No More Tasks in this Area</h4>
                                    <br />
                                    <div><Button className={'task centered'} href="#top">Back to Top</Button></div>
                                </CardBody>
                            </Card>

                            <div className='centered'>
                                <PaginationRow />
                            </div>

                    </Container>

                    <Footer/>
                </Col>

                <Col xs="8">
                    <MapContainer className="leaflet-container" center={centerLocation} zoom={15} scrollWheelZoom={true} >
                        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* Map Circle Markers - MapsCircle */}
                        {tasks.map( task => (
                            <MapsCircle title='TITLE' categoryId={task.categoryId} amount={task.amount} duration={task.duration} latitude={task.latitude} longitute={task.longitute} />
                        ))}
                        
                    </MapContainer>
                </Col>
            </Row>        
            
        </div>
    );
}

export default TestingPage;