import React, { useEffect, useState } from 'react'
import { Button, Row, Col } from 'reactstrap';
import Sidenav from '../Components/Sidenav';
import axios from 'axios';
import DataTable from 'react-data-table-component';

type userIds = {
    ids: Array<Int32List>[];
}

const AdminUsers = () => {
    const [ids, setIds] = useState<userIds>();

    const getUsers = async () => {
        await axios.post('http://ec2-54-165-213-235.compute-1.amazonaws.com:80/admin/getAllUsers', {
            adminPassword: sessionStorage.getItem('admin_pass')
        })
            .then(function (response) {
                console.log(response.data["User ID"]);
                setIds(response.data["User ID"]);
            })
            .catch(function (error) {
                console.log(error);
            });
        console.log(ids);
    }

    useEffect(() => {
        getUsers();
    }, [])

    const userData = [{ id: 1, name: 'Daniel Sanchez', pName: 'Dan', phone: '123-456-7890', email: 'sanchezd6@students.rowan.edu', gender: 'M' },
    { id: 2, name: 'Melisaa Beach', pName: 'Melissa', phone: '123-456-7890', email: 'beachm1@students.rowan.edu', gender: 'F' }];

    const userCols = [
        {
            name: 'Id',
            selector: 'id',
            sortable: true
        },
        {
            name: 'Name',
            selector: 'name',
            sortable: true
        },
        {
            name: 'Preffered Name',
            selector: 'pName',
            sortable: true
        },
        {
            name: 'Phone Number',
            selector: 'phone',
            sortable: true
        },
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
                    <DataTable title='Users' columns={userCols} data={userData} pagination />
                </Col>
            </Row>
        </div>
    );
}

export default AdminUsers;