import React, { useEffect, useState } from 'react';
import { Container, Col, Row } from 'reactstrap';
import Navigation from '../Components/Navigation';
import Footer from '../Components/Footer';
import PaginationRow from '../Components/PaginationRow';
import TaskCard from '../Components/TaskCard';
import axios from 'axios';

type taskIDs = {
    ids: []
}

const TaskBoard = () => {
    const token = localStorage.getItem('access_token');

    const getIds = async () => {
        await axios.get(`http://127.0.0.1:5000/task/getBriefPublic`,
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        getIds();
    }, []);

    return (
        <div>
            <Navigation />
            <Container>
                <h1>Task Board</h1>
                <Row xs={'1'} sm={'2'} md={'3'} className={'centered'}>
                    <Col>
                        <TaskCard title='Lawn Mowing' offerer='John Smith' price='20' description='Need help mowing lawn, cannot do it because I have a broken leg.' />
                    </Col>
                    <Col>
                        <TaskCard title='Lawn Mowing' offerer='John Smith' price='20' description='Need help mowing lawn, cannot do it because I have a broken leg.' />
                    </Col>
                    <Col>
                        <TaskCard title='Lawn Mowing' offerer='John Smith' price='20' description='Need help mowing lawn, cannot do it because I have a broken leg.' />
                    </Col>
                    <Col>
                        <TaskCard title='Lawn Mowing' offerer='John Smith' price='20' description='Need help mowing lawn, cannot do it because I have a broken leg.' />
                    </Col>
                    <Col>
                        <TaskCard title='Lawn Mowing' offerer='John Smith' price='20' description='Need help mowing lawn, cannot do it because I have a broken leg.' />
                    </Col>
                    <Col>
                        <TaskCard title='Lawn Mowing' offerer='John Smith' price='20' description='Need help mowing lawn, cannot do it because I have a broken leg.' />
                    </Col>
                    <Col>
                        <TaskCard title='Lawn Mowing' offerer='John Smith' price='20' description='Need help mowing lawn, cannot do it because I have a broken leg.' />
                    </Col>
                    <Col>
                        <TaskCard title='Lawn Mowing' offerer='John Smith' price='20' description='Need help mowing lawn, cannot do it because I have a broken leg.' />
                    </Col>
                    <Col>
                        <TaskCard title='Lawn Mowing' offerer='John Smith' price='20' description='Need help mowing lawn, cannot do it because I have a broken leg.' />
                    </Col>
                </Row>
                <div className='centered'>
                    <PaginationRow />
                </div>
            </Container>
            <Footer />
        </div>
    );
}

export default TaskBoard;