import React, { useEffect, useState, useContext } from 'react'
import { Button, Row, Col } from 'reactstrap';
import Sidenav from '../Components/Sidenav';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import APIContext from '../Contexts/APIContext';

type offer = {
    accepted: boolean,
    archived: boolean,
    jobDurationMinutes: number,
    note: string,
    offerId: number,
    payment: number,
    responseMessage: string,
    startDate: string,
    taskId: number,
    userIdFrom: number
}

const AdminOffers = () => {
    let a: offer[] = []
    const url = useContext(APIContext);

    const [offers, setOffers] = useState(a);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getOffers() {
            await axios.post(url + 'admin/getAllOffers', {
                adminPassword: sessionStorage.getItem('admin_pass')
            })
                .then(function (response) {
                    console.log(response.data);
                    setOffers(response.data.offers);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        getOffers();
    }, [])

    return (
        <div>
            <Row>
                <Col className='sidenav' xs='2'>
                    <Sidenav />
                </Col>
                <Col style={{overflow: 'scroll'}}>
                    <DataTable 
                        title='Tasks'
                        data={offers}
                        columns={[
                            {
                                name: 'Offer ID',
                                selector: 'offerId',
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Task ID',
                                selector: 'taskId',
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Offerer ID',
                                selector: 'userIdFrom',
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Accepted',
                                selector: t => t.accepted.toString(),
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Note',
                                selector: 'note',
                                sortable: true,
                                grow: 1
                            },
                            {
                                name: 'Duration',
                                selector: o => o.jobDurationMinutes + ' minutes',
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Payment',
                                selector: o => '$' + o.payment,
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Start Date',
                                selector: 'startDate',
                                sortable: true,
                                grow: 1
                            }
                        ]} striped={true} highlightOnHover={true} progressPending={loading}/>
                </Col>
            </Row>
        </div>
    );
}

export default AdminOffers;