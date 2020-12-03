import React from 'react';
import { Container, Card, CardImg, CardBody, CardTitle, Row, Col } from 'reactstrap';


const CardCategories = () => {
    return (
        <Container>
            <Row xs='1' sm='2' lg='3' xl='3' className='centered'>
                <Col>
                    <Card>
                        <CardImg top style={{ height: '250px', objectFit: 'cover' }} src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80" alt="Card image cap" />
                        <CardBody>
                            <CardTitle>Cooking</CardTitle>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardImg top style={{ height: '250px', objectFit: 'cover' }} src="https://images.unsplash.com/photo-1458245201577-fc8a130b8829?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1055&q=80" alt="Card image cap" />
                        <CardBody>
                            <CardTitle>Yard Work</CardTitle>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardImg top style={{ height: '250px', objectFit: 'cover' }} src="https://images.unsplash.com/photo-1516733968668-dbdce39c4651?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8dGF4aXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Card image cap" />
                        <CardBody>
                            <CardTitle>Transportation</CardTitle>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardImg top style={{ height: '250px', objectFit: 'cover' }} src="https://images.unsplash.com/photo-1600725935160-f67ee4f6084a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Card image cap" />
                        <CardBody>
                            <CardTitle>Moving</CardTitle>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardImg top style={{ height: '250px', objectFit: 'cover' }} src="https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F34%2F2020%2F02%2Fmop-essentials-blue-mophead-getty-0220-2000.jpg" alt="Card image cap" />
                        <CardBody>
                            <CardTitle>Cleaning</CardTitle>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardImg top style={{ height: '250px', objectFit: 'cover' }} src="https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80" alt="Card image cap" />
                        <CardBody>
                            <CardTitle>Care-Taking</CardTitle>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default CardCategories;