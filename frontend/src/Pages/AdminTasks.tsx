import React, { useEffect, useState } from 'react'
import { Button, Row, Col } from 'reactstrap';
import Sidenav from '../Components/Sidenav';
import axios from 'axios';
import DataTable from 'react-data-table-component';

type task = {
    email: string,
    gender: string,
    name: string,
    phoneNumber: string,
    preferredName: string
}

const AdminTasks = () => {
    let a: task[] = []
    const [tasks, setTasks] = useState(a);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getTasks() {
            await axios.post('http://ec2-54-165-213-235.compute-1.amazonaws.com:80/admin/getAllTasks', {
                adminPassword: sessionStorage.getItem('admin_pass')
            })
                .then(function (response) {
                    console.log(response.data);
                    //setUsers(response.data.users);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }


        getTasks();
    }, [setTasks])

    let formatPhoneNumber = (str) => {
        //Filter only numbers from the input
        let cleaned = ('' + str).replace(/\D/g, '');

        //Check if the input is of correct length
        let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        };

        return null
    };

    const userCols = [
        {
            name: 'Email',
            selector: 'email',
            sortable: true,
            grow: 2.5
        },
        {
            name: 'Gender',
            selector: 'gender',
            sortable: true
        },
        {
            name: 'Name',
            selector: 'name',
            sortable: true
        },
        {
            name: 'Phone Number',
            selector: 'phoneNumber',
            sortable: true
        },
        {
            name: 'Preffered Name',
            selector: 'prefferedName',
            sortable: true
        },
        {
            name: 'Edit',
            cell: () => <Button size='sm' color='primary'>Edit</Button>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: 'Delete',
            cell: () => <Button size='sm' color='danger'>Delete</Button>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <div>
            <Row>
                <Col className='sidenav' xs='2'>
                    <Sidenav />
                </Col>
                <Col>
                    <h1>Users</h1><hr />
                    <DataTable title='Users' columns={userCols} data={tasks} striped={true} highlightOnHover={true} progressPending={loading} pagination />
                </Col>
            </Row>
        </div>
    );
}

export default AdminTasks;