import React, { useState, useContext, useEffect } from 'react';
import {
    Card, CardText, CardBody, CardSubtitle, Button, Modal, ModalHeader,
    ModalBody, ModalFooter, Row, Col, Input, FormGroup, Spinner, Label, InputGroup, InputGroupAddon
} from 'reactstrap';
import { RiMoneyDollarBoxFill, RiUserFill, RiTimerFill, RiCalendarFill } from 'react-icons/ri'
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import APIContext from '../Contexts/APIContext';
import jwt_decode from "jwt-decode";

type CardProps = {
    id: number,
    title: string,
    offerer: number,
    price: number,
    description: string,
    duration: number
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

const TaskCard = ({ title, offerer, price, description, duration, id }: CardProps) => {
    const url = useContext(APIContext);
    const token = localStorage.getItem('access_token');

    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false);
    const [serror, setSerror] = useState(false);
    const [oerror, setOerror] = useState(false);
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

    const createOffer = async (data) => {
        setSubmitting(true)
        //console.log(data)
        if(poster?.id === user){
            setOerror(true)
            setSubmitting(false)
        }
        else {
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
                    setSuccess(true)
                })
                .catch(error => {
                    console.log(error)
                    setSubmitting(false)
                    setSerror(true)
                })
        }
    }

    return (
        <div>
            <Card>
                <CardBody>
                    <h4 style={{fontWeight: 'bolder'}}>{title}</h4>
                    <CardSubtitle style={{color: '#377fb3', fontWeight: 'bolder'}}><RiUserFill/> {poster?.name}</CardSubtitle>
                    <CardSubtitle style={{color: '#099c1a', fontWeight: 'bolder'}}><RiMoneyDollarBoxFill/> ${price}</CardSubtitle>
                    <CardSubtitle style={{fontWeight: 'bolder'}}><RiTimerFill/> 
                    {duration / 60 < 1 
                            ? ' ' + duration + ' minutes' 
                            : duration % 60 == 0 
                            ? ' ' + duration / 60 + ' hour(s)' 
                            : ' ' + Math.floor(duration / 60) + ' hour(s) ' + duration % 60 + ' minutes'}
                    </CardSubtitle>
                    {/* For when we get the start date */}
                    {/* {date.toString().substring(0,15) + ' @ ' + date.toLocaleTimeString()} */}
                    <CardSubtitle style={{fontWeight: 'bolder'}}><RiCalendarFill/> NEED Date/Time Range</CardSubtitle>
                    <CardText style={{fontWeight: 'bolder'}}>{description}</CardText>
                    <div className='centered'>
                        <Button className={'task'} onClick={launchModal}>Create Offer</Button>
                    </div>
                </CardBody>
            </Card>
            <Modal isOpen={open} toggle={() => setOpen(false)}>
                <ModalHeader>
                    <h3 id="exampleModalLiveLabel">Create offer for {title.toLowerCase()}</h3>
                    <Button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={() => setOpen(false)}>
                        <span aria-hidden={true}>×</span>
                    </Button>
                </ModalHeader>
                <ModalBody>
                    <Formik initialValues={{ payment: price, startDate: '', time: '06:00', jobDurationMinutes: duration, note: '' }} onSubmit={(data => createOffer(data))}>
                        {() => (
                            <Form >
                                {/*  Changing format to match listing page
                                <FormGroup>
                                    <Label for="payment">Payment*</Label>
                                    <Field name='payment' type='text' required as={Input}>{price}</Field>
                                </FormGroup> */}
                                <Label for="payment">Payment *</Label>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                                        <Field type="number" name="payment" min="15" as={Input} required >{price}</Field>
                                        <InputGroupAddon addonType="append">.00</InputGroupAddon>
                                    </InputGroup>
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
                                    {success ? <p className='success'>Offer succesffuly made!</p> : <div></div>}
                                </div>
                                <FormGroup className='centered'>
                                    <Row >
                                        <Col>
                                            {submitting ? <Button color="success" size='sm' outline><Spinner size='sm' />&nbsp;Creating offer...</Button> :
                                                <Button style={{ whiteSpace: 'nowrap' }} color="success" size='sm' data-dismiss="modal" type="submit" outline>
                                                    Make Offer
                                            </Button>}&nbsp;
                                        </Col>
                                        <Col>
                                            <Button color="danger" size='sm' type="button" onClick={() => setOpen(false)} outline>
                                                Cancel
                                            </Button>
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

export default TaskCard;