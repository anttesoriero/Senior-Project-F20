import { Formik, Form, Field } from 'formik';
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import APIContext from '../Contexts/APIContext';
import { Popup, Circle } from 'react-leaflet';
import { Button, Col, FormGroup, Input, InputGroup, InputGroupAddon, Label, Modal, ModalBody, ModalHeader, Row, Spinner } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { FaHashtag, FaListUl } from 'react-icons/fa';
import { RiUserFill, RiMoneyDollarBoxFill, RiTimerFill, RiCalendarFill } from 'react-icons/ri';

type CardProps = {
    id: number,
    categoryId: number,
    title: string,
    offerer: number,
    price: number,
    description: string,
    duration: number,
    startDate: string, 
    latitude: number,
    longitute: number
}

type Poster = {
    email: string
    gender: string
    id: number
    name: string
    phoneNumber: string
    preferredName: string
    profilePicture: ""
}

const MapsCircle = ({ title, offerer, price, description, duration, id, categoryId, startDate, latitude, longitute }: CardProps) => {
    const categoryNames = ["Yard Work", "Transportation", "Cleaning", "Moving", "Care-Taking", "Cooking", "Other"]
    const chosenName = categoryNames[categoryId-1]

    const categoryColor = ["green", "gray", "blue", "red", "purple", "orange", "DarkGoldenRod"]
    const chosenColor = categoryColor[categoryId-1]


    const url = useContext(APIContext);
    const token = localStorage.getItem('access_token');

    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false);
    const [redirect, setRediret] = useState(false);
    const [serror, setSerror] = useState(false);
    const [oerror, setOerror] = useState(false);
    const [dyerror, setDYerror] = useState(false);
    const [success, setSuccess] = useState(false);
    const [poster, setPoster] = useState<Poster>();
    const [user, setUser] = useState(0);

    useEffect(() => {
        getPoster()
    }, [])

    const getPoster = async () => {
        await axios.post(url + 'user/getProfile',
            {
                otherUser: offerer
            },
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                //console.log(response.data)
                setPoster(response.data)
                let curUser;
                token ? curUser = jwt_decode(token) : curUser = -1;
                setUser(curUser.identity)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const launchModal = () => {
        setOpen(true)
    }

    const today = new Date();

    const createOffer = async (data) => {
        const today = new Date()
        const yesterday = today.setDate(today.getDate() - 1)  // Needed even though unused
        let submitDY = false;
        let submitO = false;
        
        setSubmitting(true)
        
        // Don't allow submission if offer date before today
        if(Date.parse(data.startDate) < Date.parse(String(today))){
            setDYerror(true)
            setSubmitting(false)
        } else {submitDY = true}

        if (poster?.id === user) {
            setOerror(true)
            setSubmitting(false)
        } else {submitO = true}

        // if(submitO) {
        if(submitDY && submitO) { 
            await axios.post(url + 'offer/createOffer',
                {
                    taskId: id,
                    payment: data.payment,
                    startDate: data.startDate + ' ' + data.time,
                    jobDurationMinutes: data.jobDurationMinutes,
                    note: data.note
                },
                { headers: { Authorization: `Bearer ${token}` } })
                .then(response => {
                    console.log(response)
                    setSubmitting(false)
                    setDYerror(false)
                    setSerror(false)
                    setOerror(false)
                    setSuccess(true)
                })
                .catch(error => {
                    console.log(error)
                    setSubmitting(false)
                    setSerror(true)
                })
        }
    }

    const viewUser = () => {
        setRediret(true)
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

    if (redirect)
        return <Redirect to={'/user/' + poster?.id} />

    return (
        <div>
        <Circle
        center={[latitude, longitute]}
        pathOptions={{ color: chosenColor, fillColor: chosenColor }}
        radius={2000}>
            <Popup>
                {/* <h2>{title}</h2>
                <h3>Category: {categoryNames[categoryId-1]}</h3>
                <h4>${price} for {duration} minutes</h4>
                <br /> */}

                <h2>{title}</h2>
                <Row>
                    <Col xs="auto"><h5 style={{ fontWeight: 'bolder' }}><FaListUl /> {chosenName}</h5></Col>
                    <Col><h5 style={{ fontWeight: 'bold' }}><FaHashtag /> Task: {id}</h5></Col>
                </Row>
                <h5 style={{ color: '#377fb3', fontWeight: 'bolder', cursor: 'pointer' }} onClick={viewUser}><RiUserFill /> {poster?.name}</h5>
                <h5 style={{ color: '#099c1a', fontWeight: 'bolder' }}><RiMoneyDollarBoxFill /> ${price}</h5>
                <h5 style={{ color: '#c48818', fontWeight: 'bolder' }}><RiTimerFill />
                    {duration / 60 < 1
                        ? ' ' + duration + ' minutes'
                        : duration % 60 === 0
                            ? ' ' + duration / 60 + ' hour(s)'
                            : ' ' + Math.floor(duration / 60) + ' hour(s) ' + duration % 60 + ' minutes'}
                </h5>
                <h5 style={{ fontWeight: 'bolder' }}><RiCalendarFill /> {displayDate + ' @ ' + displayTime}</h5>
                
                <div className='centered'>
                    <Button className={'task'} onClick={launchModal}>Create Offer</Button>
                </div>

            </Popup>
        </Circle>

        <Modal isOpen={open} toggle={() => setOpen(false)}>
                <ModalHeader>
                    <h3 id="exampleModalLiveLabel">Create offer for task {id}: {title.toLowerCase()}</h3>
                    <Button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={() => setOpen(false)}>
                        <span aria-hidden={true}>×</span>
                    </Button>
                </ModalHeader>
                <ModalBody>
                    <Formik initialValues={{ 
                            payment: price, 
                            startDate: defaultDate, 
                            time: defaultTime, 
                            jobDurationMinutes: duration, 
                            note: '' 
                        }} 
                        onSubmit={(data => createOffer(data))}
                    >
                        {() => (
                            <Form >
                                <Label for="payment">Payment *</Label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                                    <Field type="number" name="payment" min="15" max="1000" as={Input} required >{price}</Field>
                                    <InputGroupAddon addonType="append">.00</InputGroupAddon>
                                </InputGroup>
                                <br />
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label for="startDate">Start Date *</Label>
                                            <Field name='startDate' type='date' placeholder="MM-DD-YYYY" required as={Input} />
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <Label for="time">Start Time *</Label>
                                            <Field name='time' type='time' required as={Input} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup>
                                    <Label for='jobDurationMinutes'>Job Duration in Minutes *</Label>
                                    <Field name='jobDurationMinutes' type='number' min='15' required as={Input} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for='note'>Notes</Label>
                                    <Field name='note' type='textarea' as={Input} />
                                </FormGroup>
                                <p>* are required fields</p>
                                <div className='centered'>
                                    {serror ? <p className='error'>There was an error making offer!</p> : <div></div>}
                                    {oerror ? <p className='error'>Can't make an offer on your own task!</p> : <div></div>}
                                    {dyerror ? <p className='error'>Offer date before today!</p> : <div></div>}
                                    {success ? <p className='success'>Offer successfully made!</p> : <div></div>}
                                </div>
                                <FormGroup className='centered'>
                                    <Row >
                                        <Col>
                                            {submitting ? 
                                                <Button color="success" size='sm' outline><Spinner size='sm' />&nbsp;Creating offer...</Button> 
                                                :
                                                <div>
                                                    {!success ? 
                                                        <div>
                                                            <Button style={{ whiteSpace: 'nowrap' }} color="success" size='sm' data-dismiss="modal" type="submit" outline>Make Offer</Button>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                                            <Button color="danger" size='sm' type="button" onClick={() => setOpen(false)} outline>Cancel</Button>
                                                        </div> 
                                                        : 
                                                        <div>
                                                            <Button color="info" size='sm' type="button" onClick={() => window.location.reload(false)} outline>Close</Button>
                                                        </div>
                                                    }
                                                    {/* <Button style={{ whiteSpace: 'nowrap' }} color="success" size='sm' data-dismiss="modal" type="submit" outline>Make Offer</Button>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                    <Button color="danger" size='sm' type="button" onClick={() => setOpen(false)} outline>Cancel</Button> */}
                                                </div>
                                            }
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default MapsCircle