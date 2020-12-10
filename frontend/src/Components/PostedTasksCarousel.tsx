import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';
import { RiMoneyDollarBoxFill, RiTimerFill, RiCalendarFill } from 'react-icons/ri'
import APIContext from '../Contexts/APIContext';

type taskFields = {
    accepted: boolean,
    categoryId: number,
    completed: boolean,
    description: string,
    estimatedDurationMinutes: number,
    locationALatitude: string,
    locationALongitude: string,
    posterTaskId: number,
    recommendedPrice: string,
    startDate: string,
    taskId: number,
    title: string,
    worker: number,
}

type offerFields = {
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

type task = {
    "task": taskFields,
    "offer": offerFields
}

const PostedTasksCarousel = () => {
    const url = useContext(APIContext);
    const token = localStorage.getItem('access_token');

    let a: task[] = [];

    const [tasks, setTasks] = useState(a);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [animating, setAnimating] = useState<boolean>(false);

    const getPastTasks = async () => {
        await axios.get(url + 'me/getMyPastTasks',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
                setTasks(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === tasks.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex); 
    } 

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? tasks.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }

    const dateTime = (dateTime) => {
        const date = new Date(dateTime)
        const displayDate = date.toString().substring(0, 15)
        const ampm = Number(date.toISOString().substring(11, 13)) > 11 ? ' PM' : ' AM'
        const displayTime = Number(date.toISOString().substring(11, 13)) > 12 
                            ? String((Number(date.toISOString().substring(11, 13)) % 12)) + `:${date.toISOString().substring(14, 16)}` + ampm 
                            : date.toISOString().substring(11, 16) + ampm
        return {
            displayDate: displayDate,
            displayTime: displayTime
        }
    }

    useEffect(() => {
        getPastTasks();
    }, [])

    const slides = tasks.map((item, i) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.task.taskId}
            >
                <Card style={{justifyContent: 'center', alignItems: 'center', width: 300, height: 200}} color="primary">
                    <CardBody>
                        <CardTitle tag="h4">{item.task.title}</CardTitle>
                        <CardSubtitle tag="h6"><RiMoneyDollarBoxFill /> ${item.offer.payment}</CardSubtitle>
                        <CardSubtitle tag="h6"><RiTimerFill /> {item.offer.jobDurationMinutes / 60 < 1
                                ? ' ' + item.offer.jobDurationMinutes + ' minutes'
                                : item.offer.jobDurationMinutes % 60 === 0
                                ? ' ' + item.offer.jobDurationMinutes / 60 + ' hour(s)'
                                : ' ' + Math.floor(item.offer.jobDurationMinutes / 60) + ' hour(s) ' + item.offer.jobDurationMinutes % 60 + ' minutes'}</CardSubtitle>
                        <CardSubtitle tag="h6"><RiCalendarFill /> {dateTime(item.offer.startDate).displayDate + ' ' + dateTime(item.offer.startDate).displayTime}</CardSubtitle>
                        <CardSubtitle tag="h6">{item.task.description}</CardSubtitle>
                    </CardBody>
                </Card>
            </CarouselItem>
        )
    })

    return (
        tasks.length > 0 ?
            <div>
                <Carousel
                    activeIndex={activeIndex}
                    next={next}
                    previous={previous}
                    interval={false}
                    color="blue"
                >
                    <CarouselIndicators items={tasks} activeIndex={activeIndex} onClickHandler={goToIndex} />
                        {slides}
                    <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                    <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
                </Carousel>
            </div>
            :
            <div><h2>No Tasks Posted Yet</h2></div>
    )
}

export default PostedTasksCarousel