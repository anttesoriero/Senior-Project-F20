import React, { useEffect, useState, useContext } from 'react'
import { Button, Row, Col } from 'reactstrap';
import Sidenav from '../Components/Sidenav';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import APIContext from '../Contexts/APIContext';

type task = {
    accepted: boolean
    categoryId: number
    description: string
    estimatedDurationMinutes: number
    locationALatitude: string
    locationALongitude: string
    locationBLatitude: string
    locationBLongitude: string
    posterTaskId: number
    recommendedPrice: string
    taskId: number
    title: string
}

const AdminTasks = () => {
    let a: task[] = []
    const url = useContext(APIContext);

    const [tasks, setTasks] = useState(a);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getTasks() {
            await axios.post(url + 'admin/getAllTasks', {
                adminPassword: sessionStorage.getItem('admin_pass')
            })
                .then(function (response) {
                    console.log(response.data);
                    setTasks(response.data.tasks);
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

    return (
        <div>
            <Row>
                <Col className='sidenav' xs='2'>
                    <Sidenav />
                </Col>
                <Col>
                    <h1>Tasks</h1><hr />
                    <DataTable title='Tasks'
                        data={tasks}
                        columns={[
                            {
                                name: 'Task ID',
                                selector: 'taskId',
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Title',
                                selector: 'title',
                                sortable: true
                            },
                            {
                                name: 'Accepted',
                                selector: t => t.accepted.toString(),
                                sortable: true
                            },
                            {
                                name: 'Description',
                                selector: 'description',
                                sortable: true,
                                grow: 2
                            },
                            {
                                name: 'Category ID',
                                selector: 'categoryId',
                                sortable: true
                            },
                            {
                                name: 'Duration',
                                selector: 'estimatedDurationMinutes',
                                sortable: true
                            },
                            {
                                name: 'Offerer ID',
                                selector: 'posterTaskId',
                                sortable: true
                            },
                            {
                                name: 'Price',
                                selector: 'recommendedPrice',
                                sortable: true
                            },
                            {
                                name: 'Latitude',
                                selector: 'locationALatitude',
                                sortable: true
                            },
                            {
                                name: 'Longitude',
                                selector: 'locationALongitude',
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
                        ]} striped={true} highlightOnHover={true} progressPending={loading} pagination />
                </Col>
            </Row>
        </div>
    );
}

export default AdminTasks;