import React, { useEffect, useState, useContext } from 'react'
import { Button, Row, Col } from 'reactstrap';
import Sidenav from '../Components/Sidenav';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import APIContext from '../Contexts/APIContext';

type report = {
    description: string
    reportId: number
    reportType: string
    userId_1: number
    userId_2: number
}

const AdminUsers = () => {
    const url = useContext(APIContext);
    let a: report[] = []

    const [reports, setReports] = useState(a);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getReports() {
            await axios.post(url + 'admin/getAllReports', {
                adminPassword: sessionStorage.getItem('admin_pass')
            })
                .then(function (response) {
                    console.log(response.data.reports);
                    setReports(response.data.reports);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        getReports();
    }, [])

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
            selector: 'reportId',
            sortable: true,
            grow: .5
        },
        {
            name: 'Report Type',
            selector: 'reportType',
            sortable: true,
            grow: .5
        },
        {
            name: 'Description',
            selector: 'description',
            sortable: true,
            grow: 2
        },
        {
            name: 'User ID 1',
            selector: 'userId_1',
            sortable: true
        },
        {
            name: 'User ID 2',
            selector: 'userId_2',
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
                <Col style={{overflow: 'scroll'}}>
                    <h1>Reports</h1><hr />
                    <DataTable title='Reports' columns={userCols} data={reports} striped={true} highlightOnHover={true} progressPending={loading} pagination />
                </Col>
            </Row>
        </div>
    );
}

export default AdminUsers;