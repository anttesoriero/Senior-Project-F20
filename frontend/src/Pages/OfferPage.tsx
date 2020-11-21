import React, { useState, useEffect, useContext } from 'react';
import APIContext from '../Contexts/APIContext';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import axios from 'axios';

type task = {
    accepted: boolean,
    categoryId: number,
    description: string,
    estimatedDurationMinutes: number,
    locationALatitude: string,
    locationALongitude: string,
    locationBLatitude: null,
    locationBLongitude: null,
    posterTaskId: number,
    recommendedPrice: string,
    taskId: number,
    title: string
}

const OfferPage = () => {
    const token = localStorage.getItem('access_token');
    const url = useContext(APIContext);

    let a: task[] = [];
    const [tasks, setTasks] = useState(a);

    const getTaskIds = async () => {
        await axios.get(url + 'me/getPostedTasks',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data.tasks)
                setTasks(response.data.tasks)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const getOffers = async () => {
        tasks.map(task => (
            axios.post('http://ec2-54-165-213-235.compute-1.amazonaws.com:80/offer/getOffers',
                {
                    taskId: task.taskId as unknown as string
                },
                { headers: { Authorization: `Bearer ${token}` } })
                .then(response => {
                    console.log(response.data)
                })
                .catch(error => {
                    console.log(error)
                })
        ))

    }

    useEffect(() => {
        getTaskIds()
        getOffers()
    }, [])

    return (
        <div>
            <Navigation />
            <h2>Offer Page</h2>
            {tasks.map(task => (
                <p>{task.title}</p>
            ))}
            <Footer />
        </div>
    );
}

export default OfferPage;