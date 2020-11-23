import React, { useState, useContext, useEffect } from 'react';
import {
    Card, CardText, CardBody, CardSubtitle, Button, Modal, ModalHeader,
    ModalBody, ModalFooter, Row, Col, Input, FormGroup, Spinner, Label
} from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import APIContext from '../Contexts/APIContext';

type CardProps = {
    id: number,
    title: string,
    offerer: number,
    price: number,
    description: string,
    duration: number
}

const TaskCard = ({ title, offerer, price, description, duration, id }: CardProps) => {
    const url = useContext(APIContext);
    const token = localStorage.getItem('access_token');

    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false);
    const [serror, setSerror] = useState(false);
    const [poster, setPoster] = useState('');

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
                console.log(response)
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
        console.log(data)
        console.log(title, offerer, price, description, duration, id)
        await axios.post(url + 'offer/createOffer',
            {
                taskId: id,
                payment: data.payment,
                startDate: data.startDate,
                jobDurationMinutes: data.jobDurationMinutes,
                note: data.note
            },
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response)
                setSubmitting(false)
            })
            .catch(error => {
                console.log(error)
                setSubmitting(false)
                setSerror(true)
            })
    }

    return (
        <div>
            <Card>
                <CardBody>
                    <h4>{title}</h4>
                    <CardSubtitle>{offerer}</CardSubtitle>
                    <CardSubtitle>${price}</CardSubtitle>
                    <CardSubtitle>{duration / 60} hour(s), {duration} minutes</CardSubtitle>
                    <CardText>{description}</CardText>
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
                    <Formik initialValues={{ payment: price, startDate: '', jobDurationMinutes: duration, note: '' }} onSubmit={(data => createOffer(data))}>
                        {() => (
                            <Form >
                                <FormGroup>
                                    <Label for="payment">Payment*</Label>
                                    <Field name='payment' type='text' required as={Input}>{price}</Field>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="startDate">Start Date*</Label>
                                    <Field name='startDate' type='date' required as={Input} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for='jobDurationMinutes'>Job Duration in Minutes*</Label>
                                    <Field name='jobDurationMinutes' type='text' required as={Input} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for='note'>Notes</Label>
                                    <Field name='note' type='textarea' as={Input} />
                                </FormGroup>
                                <p>* are required fields</p>
                                <div className='centered'>
                                    {serror ? <p className='error'>There was an error making offer!</p> : <div></div>}
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