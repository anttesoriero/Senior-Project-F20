import React from 'react';
import Sidenav from '../Components/Sidenav';
import { Row, Col } from 'reactstrap';
import Dashboard from '../Components/Dashboard';

const AdminDashboard = () => {
    return (
        <div>
            <Row>
                <Col className='sidenav' xs='2'>
                    <Sidenav />
                </Col>
                <Col style={{ height: '97vh', width: '100wh', overflow: 'scroll' }}>
                    <h1>Dashboard</h1><hr />
                    <Dashboard />
                </Col>
            </Row>
        </div>
    );
}

export default AdminDashboard;