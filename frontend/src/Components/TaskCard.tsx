import React, { useState } from 'react';
import { Card, CardText, CardBody, CardSubtitle, Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';

type CardProps = {
    title: string,
    offerer: string,
    price: number,
    description: string
}

const TaskCard = ({ title, offerer, price, description }: CardProps) => {
    const [open, setOpen] = useState(false)

    const launchModal = () => {
        setOpen(true)
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
                    <p>{title}</p>
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