import React, { useEffect, useState } from 'react';
import Navigation from '../Components/Navigation';
import {Button, Card, CardBody, Col, Collapse, Container, Row} from 'reactstrap';
import Footer from "../Components/Footer";
import axios from 'axios';
import Maps from "../Components/Maps";
import TaskCard from '../Components/TaskCard';
import RefineSearch from '../Components/RefineSearch';
import PaginationRow from '../Components/PaginationRow';
// import {Map, L} from 'leaflet';
// <script src="holder.js"/>


const TestingPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

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
                <Col xs="8">
                    <Maps scrollBool={true} />
                </Col>
            </Row>        
            
        </div>
    );
}

export default TestingPage;