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

type taskIDState = {
    ids: []
}

const taskIDs = {
    ids: []
}

const TestingPage = () => {
    const token = localStorage.getItem('access_token');
    /* const [task, getTaskList] = useState<taskIDState>(taskIDs); ERRORS */

    const getTaskList = async () => {
        await axios.get(`http://ec2-54-165-213-235.compute-1.amazonaws.com:80/task/recommendTasks`,
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
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
            {/* <div className="centered float"><Button color="grey" onClick={toggle} style={{ marginBottom: '1rem' }}>Open Footer</Button></div>
            <Collapse isOpen={isOpen}><Footer/></Collapse> */}

            {/* Search Bar */}
            <RefineSearch className="centered"/>

            <Row>
                {/* Left - TaskCards */}
                <Col xs="4" className="col-scroll">
                    <Container>
                            <h3 id="top" className="centered">Tasks</h3>
                            <TaskCard title='Task 1' offerer='USER' price='00' description='DESCRIPTION'/>
                            <TaskCard title='Task 2' offerer='USER' price='00' description='DESCRIPTION'/>
                            <TaskCard title='Task 3' offerer='USER' price='00' description='DESCRIPTION'/>
                            <TaskCard title='Task 4' offerer='USER' price='00' description='DESCRIPTION'/>
                            <TaskCard title='Task 5' offerer='USER' price='00' description='DESCRIPTION'/>
                            <TaskCard title='Task 6' offerer='USER' price='00' description='DESCRIPTION'/>
                            <TaskCard title='Task 7' offerer='USER' price='00' description='DESCRIPTION'/>

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

                {/* Right - Map */}
                {/* - NOTE: Removed Maps component to make it easier to add markers - 
                <Col xs="8">
                    <Maps scrollBool={true} />
                </Col> */}

                <Col xs="8">
                    <MapContainer className="leaflet-container" center={centerLocation} zoom={15} scrollWheelZoom={true} >
                        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* Map Circle Markers - MapsCircle */}
                        {/* <Circle center={[39.7085, -75.110]} pathOptions={{ fillColor: 'orange' }} radius={100}>
                            <Popup>
                                <h1>Task Title</h1>
                                <h2>Category</h2>
                                <h3>$20 for 2 hours</h3>
                            </Popup>
                        </Circle> */}

                        <MapsCircle title='TITLE' categoryId={1} amount={60} duration={60} latitude={39.7086} longitute={-75.1101} /> {/* Ready for correct inputs */}
                        
                    </MapContainer>
                </Col>
            </Row>        
            
        </div>
    );
}

export default TestingPage;