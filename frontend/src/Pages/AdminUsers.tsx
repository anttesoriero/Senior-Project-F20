import React, { useEffect, useState, useContext } from 'react'
import { Button, Row, Col } from 'reactstrap';
import Sidenav from '../Components/Sidenav';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import APIContext from '../Contexts/APIContext';

type user = {
    id: number,
    email: string,
    gender: string,
    name: string,
    phoneNumber: string,
    preferredName: string
}

const AdminUsers = () => {
    const url = useContext(APIContext);
    let a: user[] = []

    const [users, setUsers] = useState(a);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getUsers() {
            await axios.post(url + 'admin/getAllUsers', {
                adminPassword: sessionStorage.getItem('admin_pass')
            })
                .then(function (response) {
                    console.log(response.data.users);
                    setUsers(response.data.users);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        getUsers();
    }, [setUsers])

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

    const deleteUser = async id => {
        await axios.delete(url + 'me/deleteUser')
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const userCols = [
        {
            name: 'Id',
            selector: 'id',
            sortable: true
        },
        {
            name: 'Email',
            selector: 'email',
            sortable: true,
            grow: 2
        },
        {
            name: 'Gender',
            selector: 'gender',
            sortable: true,
            grow: .5
        },
        {
            name: 'Name',
            selector: 'name',
            sortable: true
        },
        {
            name: 'Phone Number',
            selector: u => formatPhoneNumber(u.phoneNumber),
            sortable: true
        },
        {
            name: 'Preferred Name',
            selector: 'preferredName',
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
            cell: () => <Button size='sm' color='danger' onClick={deleteUser}>Delete</Button>,
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
                    <DataTable title='Users' columns={userCols} data={users} striped={true} highlightOnHover={true} progressPending={loading} pagination />
                </Col>
            </Row>
        </div>
    );
}

export default AdminUsers;