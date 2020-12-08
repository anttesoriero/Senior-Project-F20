import React, { useEffect, useState, useContext } from 'react';
import Navigation from '../Components/Navigation';
import { Button, Col, Container, Navbar, Row, UncontrolledCollapse } from 'reactstrap';
import Footer from "../Components/Footer";
import axios from 'axios';
import TaskCard from '../Components/TaskCard';
import RefineSearch from '../Components/RefineSearch';
import PaginationRow from '../Components/PaginationRow';
import { TileLayer, MapContainer, useMap, useMapEvents } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import MapsCircle from '../Components/MapsCircle';
import APIContext from '../Contexts/APIContext';

type task = {
    taskId: number,
    categoryId: number,
    recommendedPrice: string,
    amount: number,
    estimatedDurationMinutes: number,
    locationALatitude: number,
    locationALongitude: number,
    title: string,
    posterTaskId: number,
    description: string,
    startDate: string
}

type location = {
    local: LatLngTuple
}

const TaskBoard = () => {
    const url = useContext(APIContext);
    const token = localStorage.getItem('access_token');

    let a: task[] = [];

    const [tasks, setTasks] = useState(a);
    const [centerLocation, setCenterLocation] = useState<LatLngTuple>();
    /* const [task, getTaskList] = useState<taskIDState>(taskIDs); ERRORS */
    const center: LatLngTuple = [0, 0]
    const tempCenter: LatLngTuple = [39.702550, -75.112005]

    const getTaskList = async () => {
        const pageURL = window.location.href
        
        // Check if the current page url contains query parameters
        if (pageURL.includes('?')) {
            searchPostedTask(pageURL)
        }
        else {
            await axios.get(url + 'task/recommendTasks',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
                console.log('getting task')
                setTasks(response.data.tasks);
                setCenterLocation([(response.data.query.location.within[1] + response.data.query.location.within[0]) / 2
                    , (response.data.query.location.within[2] + response.data.query.location.within[3]) / 2])
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    const searchPostedTask = async (pageURL) => {
        // const queryParams = {
        //     "location":
        //     {
        //         "within':
        //         {
        //             [Lower Lat, Upper Lat, Lower Long, Upper Long]
        //         }
        //     }
        // }

        // Takes http://localhost:3000/tasks?title=rake&categoryId=2&duration=30 and turns into
        // title=rake&categoryId=2&duration=30
        const queryParams = pageURL.substring(pageURL.indexOf('?') + 1, pageURL.length)

        // Array[title=rake, categoryId=2, duration=30]
        const arrayOfParams = queryParams.split('&')

        const title = arrayOfParams[0].substring(arrayOfParams[0].indexOf('=') + 1, arrayOfParams[0].length)
        const categoryID = arrayOfParams[1].substring(arrayOfParams[1].indexOf('=') + 1, arrayOfParams[1].length)
        const minPrice = arrayOfParams[2].substring(arrayOfParams[2].indexOf('=') + 1, arrayOfParams[2].length)
        const maxPrice = arrayOfParams[3].substring(arrayOfParams[3].indexOf('=') + 1, arrayOfParams[3].length)

        const queryString = {}
        if (title !== '') {
            queryString["title"] = {"contains": title}
        }
        if (categoryID !== '0') {
            queryString["categoryId"] = {"==": categoryID}
        }
        queryString["recommendedPrice"] = {">=": Number(minPrice), "<=": Number(maxPrice)}

        await axios.post(url + 'task/searchPostedTasks', {
            max: 10,
            query: queryString
        },
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                console.log('new filtered tasks: ', response.data)
                setTasks(response.data.tasks)
            })
            .catch(error => {
                console.log(error);
            });
    }

    const getIds = async () => {
        await axios.get(url + 'task/getPublic',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const MyComponent = () => {
        const map = useMapEvents({
            click: () => {
              map.locate()
            },
            move: () => {
                console.log('center: ', map.getCenter())
            },
            locationfound: (location) => {
              console.log('location found:', location)
            },
          })
          return null
    }
      

    useEffect(() => {
        getTaskList();
        //getIds();
    }, []);

    const isMobile = window.innerWidth < 1000;

    return (
        <div>
            <Navigation />

            { isMobile ?
                <div>
                    {/* Search Bar */}
                    <Navbar id="refineToggler" className="centered" color="#bbbbbb" style={{ backgroundColor: "#bbbbbb" }} light expand="sm">
                        <h4 className="centered" style={{ fontWeight: "bold" }} id="top">Refine Options</h4>
                    </Navbar>
                    <UncontrolledCollapse toggler="#refineToggler">
                        <RefineSearch className="centered" />
                    </UncontrolledCollapse>

                    {/* Map */}
                    {/* <MapContainer className="leaflet-container" center={centerLocation ? centerLocation : center} style={{height: window.innerWidth/2 }} zoom={5} scrollWheelZoom={true} > */}
                    <MapContainer className="leaflet-container" center={tempCenter} style={{ height: window.innerWidth / 2 }} zoom={5} scrollWheelZoom={true} >
                        {/* <MyComponent />
                        {console.log('temp center: ', tempCenter)} */}
                        <TileLayer
                            url="https://api.mapbox.com/styles/v1/sanchezer1757/cki7qwrxp2vlt1arsifbfcccx/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2FuY2hlemVyMTc1NyIsImEiOiJja2k3cXUzbzExbDNtMnRxc2NlZnFnenJ2In0.zCSSQC8m87qtzSpfQS7Y8A"
                            attribution='<a href="/">OddJobs</a> | <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a>'
                        />

                        {/* Map Circle Markers - MapsCircle */}
                        {tasks.map(task => (
                            <MapsCircle
                                key={task.taskId}
                                title={task.title}
                                categoryId={task.categoryId}
                                amount={Number(task.recommendedPrice)}
                                duration={task.estimatedDurationMinutes}
                                latitude={Number(task.locationALatitude)}
                                longitute={Number(task.locationALongitude)} />
                        ))}

                    </MapContainer>

                    {/* Tasks */}
                    <Container>
                        <h3 className="centered" style={{ fontWeight: 'bolder' }}>Tasks</h3>
                        <hr />
                        {tasks.map(task => (
                            <TaskCard
                                key={task.taskId}
                                id={task.taskId}
                                title={task.title}
                                offerer={task.posterTaskId}
                                price={Number(task.recommendedPrice)}
                                description={task.description}
                                duration={task.estimatedDurationMinutes}
                                startDate={task.startDate}
                            />
                        ))}

                        <hr />
                        <h4 className="centered" style={{ fontWeight: 'bolder' }}>No More Tasks in this Area</h4>&nbsp;
                        <Button className={'task centered'} href="#top">Back to Top</Button>

                        <br />
                        <div className='centered'>
                            <PaginationRow />
                        </div>

                    </Container>
                </div>

                :

                <div>
                    {/* Search Bar */}
                    <RefineSearch className="centered" />

                    {/* Page */}
                    <Row>
                        {/* Left - TaskCards */}
                        <Col xs="3" style={{ maxHeight: window.innerWidth / 2, overflowY: "scroll" }}>
                            <Container>
                                <h3 id="top" className="centered" style={{ fontWeight: 'bolder' }}>Tasks</h3>
                                <hr />
                                {tasks.map(task => (
                                    <TaskCard
                                        key={task.taskId}
                                        id={task.taskId}
                                        title={task.title}
                                        offerer={task.posterTaskId}
                                        price={Number(task.recommendedPrice)}
                                        description={task.description}
                                        duration={task.estimatedDurationMinutes}
                                        startDate={task.startDate}
                                    />
                                ))}

                                <hr />
                                <h4 className="centered" style={{ fontWeight: 'bolder' }}>No More Tasks in this Area</h4>&nbsp;
                                <Button className={'task centered'} href="#top">Back to Top</Button>

                                <br />
                                <div className='centered'>
                                    <PaginationRow />
                                </div>

                            </Container>

                        </Col>

                        <Col xs="9">
                            {/* <MapContainer className="leaflet-container" center={centerLocation ? centerLocation : center} style={{height: window.innerWidth/2 }} zoom={5} scrollWheelZoom={true} > */}
                            <MapContainer className="leaflet-container" center={tempCenter} style={{ height: window.innerWidth / 2 }} zoom={12} scrollWheelZoom={true} >
                                {/* Need to change "center" to users location - center{[userLat, userLong]} */}

                                <TileLayer
                                    url="https://api.mapbox.com/styles/v1/sanchezer1757/cki7qwrxp2vlt1arsifbfcccx/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2FuY2hlemVyMTc1NyIsImEiOiJja2k3cXUzbzExbDNtMnRxc2NlZnFnenJ2In0.zCSSQC8m87qtzSpfQS7Y8A"
                                    attribution='<a href="/">OddJobs</a> | <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a>'
                                />

                                {/* Map Circle Markers - MapsCircle */}
                                {tasks.map(task => (
                                    <MapsCircle
                                        key={task.taskId}
                                        title={task.title}
                                        categoryId={task.categoryId}
                                        amount={Number(task.recommendedPrice)}
                                        duration={task.estimatedDurationMinutes}
                                        latitude={Number(task.locationALatitude)}
                                        longitute={Number(task.locationALongitude)} />
                                ))}

                            </MapContainer>
                        </Col>
                    </Row>
                </div>
            }
            <Footer />
        </div>
    );
}

export default TaskBoard;