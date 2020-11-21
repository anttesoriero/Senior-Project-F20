import React, { useState, useContext } from 'react';
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
    offerer: string,
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

    const launchModal = () => {
        setOpen(true)
    }

    const createOffer = async (data) => {
        await axios.post(url + 'offer/createOffer',
            {
                taskId: id,
                payment: data.payment,
                startDate: data.startDate,
                jobDurationMinutes: data.jobDurationMinutes
            },
            { headers: { Authorization: `Bearer ${token}` } })
    }

    return (
        <div>
            <Card>
                <CardBody>
                    <h4>{title}</h4>
                    <CardSubtitle>{offerer}</CardSubtitle>
                    <CardSubtitle>${price}</CardSubtitle>
                    <CardText>{description}</CardText>
                    <div className='centered'>
                        <Button className={'task'} onClick={launchModal}>Create Offer</Button>
                    </div>
                </CardBody>
            </Card>
            <Modal isOpen={open} toggle={() => setOpen(false)}>
                <ModalHeader>
                    <h4 id="exampleModalLiveLabel">Create Offer</h4>
                    <Button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={() => setOpen(false)}>
                        <span aria-hidden={true}>×</span>
                    </Button>
                </ModalHeader>
                <ModalBody>
                    <Formik initialValues={{ payment: '', startDate: '', jobDurationMinutes: '' }} onSubmit={(data => createOffer(data))}>
                        {() => (
                            <Form >
                                <FormGroup>
                                    <Label for="payment">Payment</Label>
                                    <Field name='payment' type='text' required as={Input}>{price}</Field>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="startDate">Start Date</Label>
                                    <Field name='startDate' type='date' required as={Input} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for='jobDurationMinutes'>Job Duration in Minutes</Label>
                                    <Field name='jobDurationMinutes' type='text' requires as={Input} />
                                </FormGroup>
                                <div className='centered'>
                                    {serror ? <p className='error'>Incorrect Credentials!</p> : <div></div>}
                                </div>
                                <FormGroup className='centered'>
                                    {submitting ? <Button color='primary'><Spinner size='sm' />&nbsp;Signing in...</Button> : <Button type='submit' color="primary">Sign In</Button>}&nbsp;
                                </FormGroup>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
                <ModalFooter style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px', marginTop: '5px' }}>
                    &nbsp;
                    <Row >
                        <Col>
                            <Button style={{ whiteSpace: 'nowrap' }} color="success" size='sm' data-dismiss="modal" type="button" onClick={() => setOpen(false)} outline>
                                Make Offer
                            </Button>
                        </Col>
                        <Col>
                            <Button color="danger" size='sm' type="button" onClick={() => setOpen(false)} outline>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default TaskCard;