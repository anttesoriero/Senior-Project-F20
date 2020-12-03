import React, { useState, useContext, useEffect} from 'react';
import {
    Card, CardText, CardBody, CardSubtitle, Button, Modal, ModalHeader,
    ModalBody, ModalFooter, Row, Col, Input, FormGroup, Spinner, Label
} from 'reactstrap';
import axios from 'axios';
import APIContext from '../Contexts/APIContext';
import { RiMoneyDollarBoxFill, RiTimerFill, RiUserFill, RiCalendarFill } from 'react-icons/ri';

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
    const [rejected, setRejected] = useState(false);
    const [serror, setSerror] = useState(false);
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
    
    return (
        <Card style={{width: '350px', height: 'auto'}}>
            <CardBody>
                <CardSubtitle style={{color: '#377fb3', fontWeight: 'bolder'}}><RiUserFill/> {offerer?.name}</CardSubtitle>
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
                    {rejected ? <p className='success'>Offer rejected!</p> : <div></div>}
                    {accept ? <p className='success'>Offer accepted!</p> : <div></div>}
                    {accepted ? <p className='success'>Chosen Offer</p> : <div></div>}
                </div>
                <div className='centered'>
                    <Button color="success" size='sm' outline onClick={acceptOffer}>Accept Offer</Button>
                    &nbsp;&nbsp;
                    <Button color="danger" size='sm' outline onClick={rejectOffer}>Reject Offer</Button>
                </div>
            </CardBody>
        </Card>
    );
}

export default OfferCard;