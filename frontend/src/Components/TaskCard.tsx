import React from 'react';
import { Card, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';

type CardProps = {
    title: string,
    offerer: string,
    price: string,
    description: string
}

const TaskCard = ( { title, offerer, price, description }: CardProps ) => {
    return (
        <Card>
            <CardBody>
            <h4>{title}</h4>
            <CardSubtitle>{offerer}</CardSubtitle>
            <CardSubtitle>${price}</CardSubtitle>
            <CardText>{description}</CardText>
            <div className='centered'>
                <Button className={'task'}>Create Offer</Button>
            </div>
            </CardBody>
      </Card>
    );
}

export default TaskCard;