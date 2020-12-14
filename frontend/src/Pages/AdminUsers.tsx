import React, { useEffect, useState, useContext } from 'react'
import { Button, Row, Col, Modal, ModalBody, ModalHeader, Input } from 'reactstrap';
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
    preferredName: string,
    leastInterestedCategory: string,
    mostInterestedCategory: string,
    posterRating: number,
    workerRating: number
}

const AdminUsers = () => {
    const url = useContext(APIContext);
    let a: user[] = []

    const [users, setUsers] = useState(a);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [amount, setAmount] = useState(0);
    const [id, setId] = useState(0);
    const [derror, setDError] = useState(false);

    const toggle = () => setModal(!modal);

    useEffect(() => {
        async function getUsers() {
            await axios.post(url + 'admin/getAllUsers', {
                adminPassword: sessionStorage.getItem('admin_pass')
            })
                .then(function (response) {
                    setUsers(response.data.users);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        getUsers();
    }, [])

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

    const addFunds = async () => {
        await axios.post(url + 'admin/addToAccount', {
            adminPassword: sessionStorage.getItem('admin_pass'),
            userId: id,
            amountToChange: amount
        })
            .then(function (response) {
                //console.log(response)
                toggle()
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    const userCols = [
        {
            name: 'Id',
            selector: 'id',
            sortable: true,
            grow: .5
        },
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
            grow: 1.5
        },
        {
            name: 'Preferred Name',
            selector: 'preferredName',
            sortable: true
        },
        {
            name: 'Gender',
            selector: 'gender',
            sortable: true,
            grow: .5
        },
        {
            name: 'Email',
            selector: 'email',
            sortable: true,
            grow: 2
        },
        {
            name: 'Phone Number',
            selector: u => formatPhoneNumber(u.phoneNumber),
            sortable: true
        },
        {
            name: 'Least Interested Category',
            selector: 'leastInterestedCategory',
            sortable: true,
            grow: 2
        },
        {
            name: 'Most Interested Category',
            selector: 'mostInterestedCategory',
            sortable: true,
            grow: 2
        },
        {
            name: 'Worker Rating',
            selector: 'workerRating',
            sortable: true,
            grow: .5
        },
        {
            name: 'Poster Rating',
            selector: 'posterRating',
            sortable: true,
            grow: .5
        },
        {
            name: 'Deposit Funds',
            cell: () => <Button size='sm' color='primary' onClick={toggle}>Deposit</Button>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    return (
        <div>
            <Row>
                <Col className='sidenav' xs='2'>
                    <Sidenav />
                </Col>
                <Col style={{overflow: 'scroll'}}>
                    <h1>Users</h1><hr />
                    <DataTable 
                        title='Users' 
                        columns={userCols} 
                        data={users} 
                        striped={true} 
                        highlightOnHover={true} 
                        progressPending={loading} 
                        onRowClicked={row => setId(row.id)} 
                    />
                </Col>
            </Row>
            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Deposit Funds</ModalHeader>
                <ModalBody>
                    <div className='centered'>
                        <h4>How much to deposit?</h4>
                    </div>
                    <br/>
                    <div className='centered'>
                        {console.log(id)}
                        <Input type='number' pattern="[0-9]" placeholder='Funds' onChange={n => setAmount(Number(n.target.value))}/>
                    </div>
                    <hr/>
                    <div className='centered'>
                                {derror ? <p className='error'>Error depositing funds!</p> : <div></div>}
                            </div>
                    <div className='centered'>
                        <br/>
                        <Button color="success" outline onClick={addFunds}>Deposit Funds</Button>
                        &nbsp;
                        <Button color="danger" outline onClick={toggle}>Cancel</Button>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default AdminUsers;