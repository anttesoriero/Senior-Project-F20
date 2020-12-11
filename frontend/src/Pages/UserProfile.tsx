import React, { useEffect, useState, useContext } from 'react';
import Navigation from '../Components/Navigation';
import { Container, Row, Col, Button, Media, Input, Label, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Footer from "../Components/Footer";
import axios from 'axios';
import 'reactjs-popup/dist/index.css';
import { Formik, Form, Field } from 'formik';
import APIContext from '../Contexts/APIContext';
import { FaStar } from 'react-icons/fa';

type userState = {
    email: string,
    name: string,
    preferredName: string,
    accountBalance: number,
    address: string,
    phoneNumber: string,
    bio: string,
    profilePicture: string,
    posterRating: number | null,
    workerRating: number | null
}

const userInfo = {
    email: "",
    name: "",
    preferredName: "",
    accountBalance: 0,
    address: "",
    phoneNumber: "",
    bio: "",
    profilePicture: "",
    posterRating: null,
    workerRating: null
}

const UserProfile = () => {
    const token = localStorage.getItem('access_token');
    const url = useContext(APIContext);
    const isMobile = window.innerWidth < 1000;

    const [user, setUser] = useState<userState>(userInfo);
    const [initials, setInitials] = useState<String>("");
    const [modal, setModal] = useState(false);

    let formatPhoneNumber = (str) => {
        //Filter only numbers from the input
        let cleaned = ('' + str).replace(/\D/g, '');

        //Check if the input is of correct length
        let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        };

        return null
    };

    const getUser = async () => {
        console.log(window.location.href.slice(-1))
        await axios.get(url + 'user/getBriefProfile?otherUser=' + window.location.href.slice(-1),
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
                const firstName = response.data.name.split(' ')[0]
                const lastName = response.data.name.split(' ')[1]
                const initials = firstName.charAt(0) + lastName.charAt(0)
                setUser(response.data)
                setInitials(initials)
            })
            .catch(error => {
                console.log(error);
            });
    }

    const reportUser = async (values) => {
        const userId_2 = window.location.href.slice(-1)
        console.log('values: ', values)
        
        await axios.put(url + 'me/reportUser', {
            userId_2: userId_2,
            reportType: values.picked,
            description: values.description
        },
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log('response: ', response)
                toggle()
            })
            .catch(error => {
                console.log(error);
            });
    }

    const toggle = () => setModal(!modal);

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div>
            <Navigation/>
            <Container>
                <h1 id="centered" style={{ fontWeight: 'bold' }}>User Page</h1>
                <br />
                {/* Upper - Main user info and edit button */}
                {isMobile ?
                    <div> {/* MOBILE */}
                        {/* User Info */}
                        <Media>
                            <Media left href="#">
                                {user.profilePicture === "" ?                                                
                                    <Button disabled style={{borderRadius: 10, fontSize: 60, marginTop: '10%', paddingLeft: 30, paddingRight: 30, height: 160, width: 160}}>
                                        {initials}
                                    </Button>
                                :
                                    <Media object src={user.profilePicture} alt="Generic placeholder image" height="160" width="160" />
                                }        
                            </Media>
                            <Media body style={{ padding: 10 }}>
                                <div style={{ marginTop: '-3%', marginLeft: '3%' }}>
                                    <h4>{user.name}</h4>
                                    <h5>Goes by: 
                                        {user.preferredName ? " " + user.preferredName : ' ' + user.name.split(' ')[0]}
                                    </h5>
                                
                                    <p>{user.posterRating === null  
                                                            ? 'Poster Rating: No Ratings Yet' 
                                                            :        
                                                            <div>
                                                                Poster Rating: 
                                                            {[...Array(Math.round(user.posterRating))].map((star, i) => {
                                                                return(
                                                                    <label>
                                                                        <FaStar 
                                                                            style={{cursor: 'pointer', transition: 'color 200ms'}} 
                                                                            size={15} 
                                                                            color={'#ffc107'}
                                                                        />
                                                                    </label>
                                                                )
                                                            })}
                                                            {[...Array(5 - Math.round(user.posterRating))].map((star, i) => {
                                                                return(
                                                                    <label>
                                                                        <FaStar 
                                                                            style={{cursor: 'pointer', transition: 'color 200ms'}} 
                                                                            size={15} 
                                                                            color={'#e4e5e6'}
                                                                        />
                                                                    </label>
                                                                )
                                                            })}
                                                        </div>}
                                        </p>
                                        <p>{user.workerRating === null  
                                                            ? 'Worker Rating: No Ratings Yet' 
                                                            :        
                                                            <div>
                                                                Worker Rating: 
                                                            {[...Array(user.workerRating)].map((star, i) => {
                                                                return(
                                                                    <label>
                                                                        <FaStar 
                                                                            style={{cursor: 'pointer', transition: 'color 200ms'}} 
                                                                            size={15} 
                                                                            color={'#ffc107'}
                                                                        />
                                                                    </label>
                                                                )
                                                            })}
                                                            {[...Array(5 - user.workerRating)].map((star, i) => {
                                                                return(
                                                                    <label>
                                                                        <FaStar 
                                                                            style={{cursor: 'pointer', transition: 'color 200ms'}} 
                                                                            size={15} 
                                                                            color={'#e4e5e6'}
                                                                        />
                                                                    </label>
                                                                )
                                                            })}
                                                        </div>}
                                        </p>
                                </div>
                            </Media>
                        </Media>
                        <br />
                        <Button onClick={toggle} outline color="danger" size="sm">Report User</Button>{' '}
                    </div>
                :
                    <div>
                    <Row> {/* NORMAL */}
                        {/* Left - Prof Pic, name, and basic info */}
                        <Col xs="10">
                            <Media>
                                <Media left href="#">
                                    {user.profilePicture === "" ?                                                
                                        <Button disabled style={{borderRadius: 10, fontSize: 60, marginTop: '10%', paddingLeft: 30, paddingRight: 30, height: 160, width: 160}}>
                                            {initials}
                                        </Button>
                                    :
                                        <Media object src={user.profilePicture} alt="Generic placeholder image" height="160" width="160" />
                                    }        
                                </Media>
                                <Media body style={{ padding: 10 }}>
                                    <div style={{ marginTop: '-3%', marginLeft: '3%' }}>
                                        <h4>{user.name}</h4>
                                        <h5>Goes by: 
                                            {user.preferredName ? " " + user.preferredName : ' ' + user.name.split(' ')[0]}
                                        </h5>

                                        <p>{user.posterRating === null  
                                                            ? 'Poster Rating: No Ratings Yet' 
                                                            :        
                                                            <div>
                                                                Poster Rating: 
                                                            {[...Array(Math.round(user.posterRating))].map((star, i) => {
                                                                return(
                                                                    <label>
                                                                        <FaStar 
                                                                            style={{cursor: 'pointer', transition: 'color 200ms'}} 
                                                                            size={15} 
                                                                            color={'#ffc107'}
                                                                        />
                                                                    </label>
                                                                )
                                                            })}
                                                            {[...Array(5 - Math.round(user.posterRating))].map((star, i) => {
                                                                return(
                                                                    <label>
                                                                        <FaStar 
                                                                            style={{cursor: 'pointer', transition: 'color 200ms'}} 
                                                                            size={15} 
                                                                            color={'#e4e5e6'}
                                                                        />
                                                                    </label>
                                                                )
                                                            })}
                                                        </div>}
                                        </p>
                                        <p>{user.workerRating === null  
                                                            ? 'Worker Rating: No Ratings Yet' 
                                                            :        
                                                            <div>
                                                                Worker Rating: 
                                                            {[...Array(user.workerRating)].map((star, i) => {
                                                                return(
                                                                    <label>
                                                                        <FaStar 
                                                                            style={{cursor: 'pointer', transition: 'color 200ms'}} 
                                                                            size={15} 
                                                                            color={'#ffc107'}
                                                                        />
                                                                    </label>
                                                                )
                                                            })}
                                                            {[...Array(5 - user.workerRating)].map((star, i) => {
                                                                return(
                                                                    <label>
                                                                        <FaStar 
                                                                            style={{cursor: 'pointer', transition: 'color 200ms'}} 
                                                                            size={15} 
                                                                            color={'#e4e5e6'}
                                                                        />
                                                                    </label>
                                                                )
                                                            })}
                                                        </div>}
                                        </p>
                                    </div>
                                </Media>
                            </Media>
                        </Col>
                    </Row>
                    <br />
                    <Button onClick={toggle} outline color="danger" size="sm">Report User</Button>{' '}
                    </div>
                }  
                <br />
                {/* Lower - Job History and About */}
                {isMobile ? 
                <div> {/* MOBILE */}
                    {/* About */}
                    <h2 style={{ fontWeight: 'bold' }}>About</h2>
                    <hr />
                        {/* Left - About Info */}
                        <h4>Bio</h4>
                        {user ?
                            <Col><p>{user.bio}</p></Col>
                            :
                            <Col><p>User bio</p></Col>
                        }
                        <h4>Liked Jobs</h4>
                        <p>Selected liked job categories from survey</p>
                        <h4>Contact Info</h4>
                        {/* Phone */}
                        <Row>
                            <Col xs="2"><p>Phone:</p></Col>
                            {user ?
                                <Col xs="10"><p>{formatPhoneNumber(user.phoneNumber)}</p></Col>
                                :
                                <Col xs="10"><p>###-###-####</p></Col>
                            }  
                        </Row>
                        {/* Email */}
                        <Row>
                            <Col xs="2"><p>Email:</p></Col>
                            {user ?
                                <Col xs="10"><p>{user.email}</p></Col>
                                :
                                <Col xs="10"><p>user@email.com</p></Col>
                            }
                        </Row>
                </div>
                :
                <Row> {/* NORMAL */}
                    {/* Right - About */}
                    <Col xs="8">
                        <h2 style={{ fontWeight: 'bold' }}>About</h2>
                        <hr />
                        <Row>
                            {/* Left - About Info */}
                            <Col xs="6">
                                <h4>Bio</h4>
                                {user ?
                                    <Col xs="10"><p>{user.bio}</p></Col>
                                    :
                                    <Col xs="10"><p>User bio</p></Col>
                                }
                                <h4>Liked Jobs</h4>
                                <p>Selected liked job categories from survey</p>
                                <h4>Contact Info</h4>
                                {/* Phone */}
                                <Row>
                                    <Col xs="2"><p>Phone:</p></Col>
                                    {user ?
                                        <Col xs="10"><p>{formatPhoneNumber(user.phoneNumber)}</p></Col>
                                        :
                                        <Col xs="10"><p>###-###-####</p></Col>
                                    }  
                                </Row>
                                {/* Email */}
                                <Row>
                                    <Col xs="2"><p>Email:</p></Col>
                                    {user ?
                                        <Col xs="10"><p>{user.email}</p></Col>
                                        :
                                        <Col xs="10"><p>user@email.com</p></Col>
                                    }
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>}

                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Report this User</ModalHeader>
                    <ModalBody>
                        Please select the category that this user violated:
                        <Formik
                            initialValues={{
                                picked: '',
                            }}
                            onSubmit={values => reportUser(values)}
                        >
                            {({ values }) => (
                            <Form>
                                <div role="group" aria-labelledby="my-radio-group">
                                    <label>
                                        <Field type="radio" name="picked" value="Scam" />
                                        <span>&nbsp;&nbsp;</span>
                                        Scam
                                    </label>
                                    <br />

                                    <label>
                                        <Field type="radio" name="picked" value="Harassment" />
                                        <span>&nbsp;&nbsp;</span>
                                        Harassment
                                    </label>
                                    <br />

                                    <label>
                                        <Field type="radio" name="picked" value="Fake Account" />
                                        <span>&nbsp;&nbsp;</span>
                                        Fake Account
                                    </label>
                                    <br />

                                    <label>
                                        <Field type="radio" name="picked" value="Inappropriate" />
                                        <span>&nbsp;&nbsp;</span>
                                        Inappropriate
                                    </label>
                                    <br />

                                    <label>
                                        <Field type="radio" name="picked" value="Illegal Activity" />
                                        <span>&nbsp;&nbsp;</span>
                                        Illegal Activity
                                    </label>
                                    <br />

                                    <label>
                                        <Field type="radio" name="picked" value="Other" />
                                        <span>&nbsp;&nbsp;</span>
                                        Other
                                    </label>
                                    <br />

                                    <label>
                                        <Label for="description">Please provide details as to why you are reporting this user:</Label>
                                        <Field type="textarea" name="description" placeholder="Description" required as={Input} />
                                    </label>
                                    <br />
                                </div>

                                <br />
                                <Button color="danger" type="submit">Report</Button>{' '}

                            </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </Modal>

            </Container>
            <Footer/>
        </div>
    )
}

export default UserProfile;