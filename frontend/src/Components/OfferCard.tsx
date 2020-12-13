import React, { useState, useContext, useEffect } from 'react';
import { Card, CardText, CardBody, CardSubtitle, Button, Input, Label, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import APIContext from '../Contexts/APIContext';
import { RiMoneyDollarBoxFill, RiTimerFill, RiUserFill, RiCalendarFill } from 'react-icons/ri';
import { Redirect } from 'react-router-dom';
import StarRating from './StarRating';

type CardProps = {
    accepted: boolean,
    archived: boolean,
    jobDurationMinutes: number,
    note: string,
    offerId: number,
    payment: number,
    responseMessage: null,
    startDate: string,
    taskId: number,
    userIdFrom: number
}

type Offerer = {
    email: string
    gender: string
    id: number
    name: string
    phoneNumber: string
    preferredName: string
    profilePicture: ""
}

const OfferCard = ({ accepted, archived, jobDurationMinutes, note, offerId, payment, responseMessage, startDate, taskId, userIdFrom }: CardProps) => {
    const url = useContext(APIContext);
    const token = localStorage.getItem('access_token');

    const [offerer, setOfferer] = useState<Offerer>();
    const [accept, setAccept] = useState(false);
    const [redirect, setRediret] = useState(false);
    const [complete, setComplete] = useState(false);
    const [rejected, setRejected] = useState(false);
    const [serror, setSerror] = useState(false);
    const [cerror, SetCError] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalRate, setModalRate] = useState(false);

    var date = new Date(startDate);

    useEffect(() => {
        getOfferer()
    }, [])

    const getOfferer = async () => {
        await axios.post(url + 'user/getProfile',
            {
                otherUser: userIdFrom
            },
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setOfferer(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const acceptOffer = async () => {
        await axios.post(url + 'offer/acceptOffer', {
            offerId: offerId
        },
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setAccept(true)
                window.location.reload(false);
            })
            .catch(error => {
                console.log(error)
                setSerror(true)
            })
    }

    const rejectOffer = async () => {
        await axios.post(url + 'offer/rejectOffer', {
            offerId: offerId
        },
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setRejected(true)
            })
            .catch(error => {
                console.log(error)
                setSerror(true)
            })
    }

    const completeOffer = async () => {
        const rating = localStorage.getItem('rating')
        await axios.post(url + 'task/posterCompleted', {
            taskId: taskId,
            workerRating: rating
        },
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response)
                setComplete(true)
                window.location.reload(false);
            })
            .catch(error => {
                console.log(error)
                SetCError(true)
            })
    }

    const reportUser = async (values) => {
        await axios.put(url + 'me/reportUser', {
            userId_2: userIdFrom,
            reportType: values.picked,
            description: values.description
        },
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                toggle()
            })
            .catch(error => {
                console.log(error);
            });
    }

    const dateTime = (dateTime) => {
        const date = new Date(dateTime)
        const displayDate = date.toString().substring(0, 15)
        const ampm = Number(date.toISOString().substring(11, 13)) > 11 ? ' PM' : ' AM'
        const displayTime = Number(date.toISOString().substring(11, 13)) > 12 
                            ? String((Number(date.toISOString().substring(11, 13)) % 12)) + `:${date.toISOString().substring(14, 16)}` + ampm 
                            : date.toISOString().substring(11, 16) + ampm
        return {
            defaultDate: date.toISOString().substring(0, 10), 
            defaultTime: date.toISOString().substring(11, 16),
            displayDate: displayDate,
            displayTime: displayTime
        }
    }

    const { defaultDate, defaultTime, displayDate, displayTime } = dateTime(startDate)

    const viewUser = () => {
        setRediret(true)
    }

    const toggle = () => setModal(!modal);
    const toggleRate = () => setModalRate(!modalRate);

    if (redirect)
        return <Redirect to={'/user/' + userIdFrom} />
    return (
        <div>
            <Card style={{ width: '325px', height: 'auto' }}>
                <CardBody>
                    <CardSubtitle style={{ color: '#377fb3', fontWeight: 'bolder', cursor: 'pointer' }} onClick={viewUser}><RiUserFill /> {offerer?.name}</CardSubtitle>
                    <CardSubtitle style={{ color: '#099c1a', fontWeight: 'bolder' }}><RiMoneyDollarBoxFill /> ${payment}</CardSubtitle>
                    <CardSubtitle style={{ color: '#c48818', fontWeight: 'bolder' }}><RiTimerFill />
                        {jobDurationMinutes / 60 < 1
                            ? ' ' + jobDurationMinutes + ' minutes'
                            : jobDurationMinutes % 60 === 0
                                ? ' ' + jobDurationMinutes / 60 + ' hour(s)'
                                : ' ' + Math.floor(jobDurationMinutes / 60) + ' hour(s) ' + jobDurationMinutes % 60 + ' minutes'}
                    </CardSubtitle>
                    <CardSubtitle style={{ fontWeight: 'bolder' }}><RiCalendarFill /> {displayDate + ' @ ' + displayTime}</CardSubtitle>                
                    <CardText style={{ fontWeight: 'bolder' }}>{note}</CardText>
                    <div className='centered'>
                        {serror ? <p className='error'>There was an error accepting/rejecting offer!</p> : <div></div>}
                        {cerror ? <p className='error'>Error completing offer!</p> : <div></div>}
                        {rejected ? <p className='success'>Offer rejected!</p> : <div></div>}
                        {accept ? <p className='success'>Offer accepted!</p> : <div></div>}
                        {complete ? <p className='warning'>Offer completed!</p> : <div></div>}
                    </div>
                    <div className='centered'>
                        {accepted ? <p className='success'>Chosen Offer</p> : <div></div>}
                    </div>
                    <div className='centered'>
                        {accepted
                            ?
                            <div>
                                <Button color="success" size='sm' outline onClick={toggleRate} style={{ whiteSpace: 'nowrap' }}>Complete Offer</Button>
                                &nbsp;&nbsp;
                                <Button color="danger" size='sm' outline onClick={toggle} style={{ whiteSpace: 'nowrap' }}>Report User</Button>
                                <Modal isOpen={modal} toggle={toggle}>
                                    <ModalHeader toggle={toggle}>Report this User</ModalHeader>
                                    <ModalBody>
                                        Please select the category that this user violated:
                                        <Formik
                                            initialValues={{
                                                picked: '',
                                            }}
                                            onSubmit={values => reportUser(values)}
                                        >
                                            {({ values }) => (
                                            <Form>
                                                <div role="group" aria-labelledby="my-radio-group">
                                                    <label>
                                                        <Field type="radio" name="picked" value="Scam" />
                                                        <span>&nbsp;&nbsp;</span>
                                                        Scam
                                                    </label>
                                                    <br />

                                                    <label>
                                                        <Field type="radio" name="picked" value="Harassment" />
                                                        <span>&nbsp;&nbsp;</span>
                                                        Harassment
                                                    </label>
                                                    <br />

                                                    <label>
                                                        <Field type="radio" name="picked" value="Fake Account" />
                                                        <span>&nbsp;&nbsp;</span>
                                                        Fake Account
                                                    </label>
                                                    <br />

                                                    <label>
                                                        <Field type="radio" name="picked" value="Inappropriate" />
                                                        <span>&nbsp;&nbsp;</span>
                                                        Inappropriate
                                                    </label>
                                                    <br />

                                                    <label>
                                                        <Field type="radio" name="picked" value="Illegal Activity" />
                                                        <span>&nbsp;&nbsp;</span>
                                                        Illegal Activity
                                                    </label>
                                                    <br />

                                                    <label>
                                                        <Field type="radio" name="picked" value="Other" />
                                                        <span>&nbsp;&nbsp;</span>
                                                        Other
                                                    </label>
                                                    <br />

                                                    <label>
                                                        <Label for="description">Please provide details as to why you are reporting this user:</Label>
                                                        <Field type="textarea" name="description" placeholder="Description" required as={Input} />
                                                    </label>
                                                    <br />
                                                </div>

                                                <br />
                                                <Button color="danger" type="submit">Report</Button>{' '}
                                            </Form>
                                            )}
                                        </Formik>
                                    </ModalBody>
                                </Modal>
                            </div>
                            :
                            <div>
                                <Button color="success" size='sm' outline onClick={acceptOffer}>Accept Offer</Button>
                                &nbsp;&nbsp;
                                <Button color="danger" size='sm' outline onClick={rejectOffer}>Reject Offer</Button>
                            </div>
                        }

                    </div>
                </CardBody>
            </Card>
            <Modal isOpen={modalRate} toggle={toggleRate} >
                <ModalHeader toggle={toggleRate}>Complete Task</ModalHeader>
                <ModalBody>
                    <div className='centered'>
                        <h4>How would you rate the worker?</h4>
                    </div>
                    <br/>
                    <div className='centered'>
                        &nbsp;<StarRating/>
                    </div>
                    <hr/>
                    <div className='centered'>
                        <br/>
                        <Button color="success" outline onClick={completeOffer}>Complete</Button>
                        &nbsp;
                        <Button color="danger" outline onClick={toggleRate}>Cancel</Button>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default OfferCard;