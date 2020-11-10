import React, { useEffect } from 'react'
import { Row, Col } from 'reactstrap';
import axios from 'axios';
import Sidenav from '../Components/Sidenav';

const AdminTasks = () => {
    const getTasks = async () => {
        await axios.post('http://ec2-54-165-213-235.compute-1.amazonaws.com:80/admin/getAllTasks', {
            adminPassword: sessionStorage.getItem('admin_pass')
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        getTasks();
    }, [])
    return (
        <div>
            <Row>
                <Col className='sidenav' xs='2'>
                    <Sidenav />
                </Col>
                <Col>
                    <h1>Tasks</h1>
                </Col>
            </Row>
        </div>
    );
}

export default AdminTasks;