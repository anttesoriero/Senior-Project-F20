import React from 'react';
import { Container, Card, CardImg, CardBody, CardTitle, Row, Col } from 'reactstrap';


const CardCategories = () => {
    return (
        <Container>
            <Row xs='1' sm='2' lg='3' xl='3' className='centered'>
                <Col>
                    <Card>
                        <CardImg top style={{ height: '250px', objectFit: 'cover' }} src="https://www.fox13memphis.com/resizer/JCCEXFjPNprRMRjdcLoc037KrUE=/1200x675/cloudfront-us-east-1.images.arcpublishing.com/cmg/HKBIHNHFRBF4HMRRGJT6KZCXAQ.jpg" alt="Card image cap" />
                        <CardBody>
                            <CardTitle>Geting Groceries</CardTitle>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardImg top style={{ height: '250px', objectFit: 'cover' }} src="https://images.unsplash.com/photo-1458245201577-fc8a130b8829?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1055&q=80" alt="Card image cap" />
                        <CardBody>
                            <CardTitle>Mowing Lawns</CardTitle>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardImg top style={{ height: '250px', objectFit: 'cover' }} src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80ss" alt="Card image cap" />
                        <CardBody>
                            <CardTitle>Building Furniture</CardTitle>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardImg top style={{ height: '250px', objectFit: 'cover' }} src="https://images.unsplash.com/photo-1583661047299-0fda75994262?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80" alt="Card image cap" />
                        <CardBody>
                            <CardTitle>Walking Dogs</CardTitle>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardImg top style={{ height: '250px', objectFit: 'cover' }} src="https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F34%2F2020%2F02%2Fmop-essentials-blue-mophead-getty-0220-2000.jpg" alt="Card image cap" />
                        <CardBody>
                            <CardTitle>Doing Housework</CardTitle>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardImg top style={{ height: '250px', objectFit: 'cover' }} src="https://images.unsplash.com/photo-1438109382753-8368e7e1e7cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" alt="Card image cap" />
                        <CardBody>
                            <CardTitle>Gardening</CardTitle>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default CardCategories;