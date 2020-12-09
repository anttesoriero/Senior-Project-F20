import React, { useState, useContext, useEffect } from 'react';
import { Card, CardText, CardBody, CardSubtitle, Button, Input, Label, Modal, ModalHeader, ModalBody,UncontrolledPopover, PopoverBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import APIContext from '../Contexts/APIContext';
import { RiMoneyDollarBoxFill, RiTimerFill, RiUserFill, RiCalendarFill } from 'react-icons/ri';
import { Redirect } from 'react-router-dom';
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css'
import { setSyntheticTrailingComments } from 'typescript';
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

const UpcommingTaskCard = ({ accepted, archived, jobDurationMinutes, note, offerId, payment, responseMessage, startDate, taskId, userIdFrom }: CardProps) => {
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
    //const [rating, setRating] = useState(0);
    var rating = 0;

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
                console.log(response.data)
                setOfferer(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const retractOffer = async () => {
        await axios.post(url + 'offer/retractOffer', {
            offerId: offerId
        },
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                //console.log(response.data)
                setRejected(true)
                window.location.reload(false);
            })
            .catch(error => {
                console.log(error)
                setSerror(true)
            })
    }

    const ratePoster = async () => {
        const rating = localStorage.getItem('rating')
        console.log(rating)
        await axios.post(url + 'task/workerCompleted', {
            taskId: taskId,
            posterRating: rating
        },
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                //console.log(response.data)
                toggle()
            })
            .catch(error => {
                console.log(error)
                SetCError(true)
            })
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

    if (redirect)
        return <Redirect to={'/user/' + userIdFrom} />
    return (
        <div>
        
        <Card style={{ width: '350px', height: 'auto' }}>
            <CardBody>
                <CardSubtitle style={{ color: '#377fb3', fontWeight: 'bolder', cursor: 'pointer' }} onClick={viewUser}><RiUserFill /> {offerer?.name}</CardSubtitle>
                <CardSubtitle style={{ color: '#099c1a', fontWeight: 'bolder' }}><RiMoneyDollarBoxFill /> ${payment}</CardSubtitle>
                <CardSubtitle style={{ fontWeight: 'bolder' }}><RiTimerFill />
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
                    {rejected ? <p className='success'>Offer retracted!</p> : <div></div>}
                    {accept ? <p className='success'>Offer accepted!</p> : <div></div>}
                    {complete ? <p className='warning'>Offer completed!</p> : <div></div>}
                </div>
                <div className='centered'>
                    {accepted 
                    ? <p className='success'>Offer Accepted!</p> : <div></div>}
                </div>
                <div className='centered'>
                        <div>
                            {accepted 
                                ? 
                                    <Button color="warning" size='sm' outline onClick={toggle}>Rate User</Button>
                                : 
                                <div>
                                    <UncontrolledPopover style={{padding: 10}} placement="bottom" target="confirmDelete">
                                        <h3>Are you sure?</h3>
                                        <PopoverBody>This cannot be undone</PopoverBody>
                                        <Button color="danger" size="sm" type="submit" onClick={() => retractOffer()}>Confirm</Button>
                                        <br />
                                    </UncontrolledPopover>
                                    <Button color="danger" size='sm' id="confirmDelete" outline>Retract Offer</Button>
                                </div>
                                    
                            }
                            &nbsp;
                            <Button color="danger" size='sm' outline onClick={viewUser}>Report User</Button>
                        </div>
                </div>
            </CardBody>
        </Card>
        <Modal isOpen={modal} toggle={toggle} >
            <ModalHeader toggle={toggle}>Rate Poster</ModalHeader>
            <ModalBody>
                <div className='centered'>
                    <StarRating/>
                </div>
                <div className='centered'>
                    <br/>
                    <Button color="warning" outline onClick={ratePoster}>Rate</Button>
                    &nbsp;
                    <Button color="danger" outline onClick={toggle}>Cancel</Button>
                </div>
            </ModalBody>
      </Modal>
        </div>
    );
}

export default UpcommingTaskCard;