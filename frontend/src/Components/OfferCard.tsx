import React, { useState, useContext, useEffect} from 'react';
import {
    Card, CardText, CardBody, CardSubtitle, Button, Modal, ModalHeader,
    ModalBody, ModalFooter, Row, Col, Input, FormGroup, Spinner, Label
} from 'reactstrap';
import axios from 'axios';
import APIContext from '../Contexts/APIContext';
import { RiMoneyDollarBoxFill, RiTimerFill, RiUserFill, RiCalendarFill } from 'react-icons/ri';
import { Redirect } from 'react-router-dom';

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

    const acceptOffer = async () => {
        await axios.post(url + 'offer/acceptOffer', {
            offerId: offerId},
        { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data)
                setAccept(true)
            })
            .catch(error => {
                console.log(error)
                setSerror(true)
            })
    }

    const rejectOffer = async () => {
        await axios.post(url + 'offer/rejectOffer', {
            offerId: offerId},
        { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data)
                setRejected(true)
            })
            .catch(error => {
                console.log(error)
                setSerror(true)
            })
    }

    const completeOffer = async () => {
        await axios.post(url + 'task/completed', {
            taskId: taskId},
        { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data)
                setComplete(true)
            })
            .catch(error => {
                console.log(error)
                SetCError(true)
            })
    }

    const viewUser = () => {
        setRediret(true)
    }

    if(redirect)
        return <Redirect to={'/user/' + userIdFrom} />
    return (
        <Card style={{width: '350px', height: 'auto'}}>
            <CardBody>
                <CardSubtitle style={{color: '#377fb3', fontWeight: 'bolder', cursor: 'pointer'}} onClick={viewUser}><RiUserFill/> {offerer?.name}</CardSubtitle>
                <CardSubtitle style={{color: '#099c1a', fontWeight: 'bolder'}}><RiMoneyDollarBoxFill/> ${payment}</CardSubtitle>
                <CardSubtitle style={{fontWeight: 'bolder'}}><RiTimerFill/> 
                {jobDurationMinutes / 60 < 1 
                            ? ' ' + jobDurationMinutes + ' minutes' 
                            : jobDurationMinutes % 60 == 0 
                            ? ' ' + jobDurationMinutes / 60 + ' hour(s)' 
                            : ' ' + Math.floor(jobDurationMinutes / 60) + ' hour(s) ' + jobDurationMinutes % 60 + ' minutes'}
                </CardSubtitle>
                <CardSubtitle style={{fontWeight: 'bolder'}}><RiCalendarFill/> {date.toString().substring(0,15) + ' @ ' + date.toLocaleTimeString()}</CardSubtitle>
                <CardText style={{fontWeight: 'bolder'}}>{note}</CardText>
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
                    { accepted 
                        ?
                        <div>
                            <Button color="success" size='sm' outline onClick={completeOffer}>Offer Completed</Button>
                            &nbsp;&nbsp;
                            <Button color="danger" size='sm' outline onClick={rejectOffer}>Report User</Button>
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
    );
}

export default OfferCard;