import React from 'react'
import { FaStar } from 'react-icons/fa'
import { Container, Media, Button, Row, Col } from 'reactstrap'
import TasksCompletedCarousel from './TasksCompletedCarousel'
import PostTasksCarousel from './PostedTasksCarousel';

type userState = {
    email: string,
    name: string,
    preferredName: string,
    accountBalance: number,
    phoneNumber: string,
    bio: string,
    profilePicture: string,
    address: string,
    posterRating: number | null,
    workerRating: number | null,
    mostInterestedCategory: string,
    leastInterestedCategory: string
}

type  MainProfileProps = {
    isMobile: boolean,
    user: userState,
    initials: String,
    wantToEdit: Function,
    wantToChange: Function
}

const MainProfile = ({isMobile, user, initials, wantToEdit, wantToChange}: MainProfileProps) => {
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

    return(
        <Container>
            <h1 id="centered" style={{ fontWeight: 'bold' }}>Profile</h1>
            <br />
            {/* Upper - Main user info and edit button */}
            {isMobile ?
                <div> {/* MOBILE */}
                    {/* User Info */}
                    <Media>
                        <Media left href="#">
                            {user.profilePicture === "" ?                                                
                                <Button 
                                    disabled 
                                    style={{borderRadius: 10, fontSize: 60, marginTop: '10%', paddingLeft: 30, paddingRight: 30, height: 160, width: 160}}>
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
                                <p>Account Balance: ${String(user.accountBalance)}</p>
                            </div>
                        </Media>
                    </Media>
                    <br />
                    
                    {/* Buttons */}
                    <Button onClick={() => wantToEdit()} outline color="primary" size="sm">Edit Profile</Button>{' '}
                    &nbsp;&nbsp;
                    <Button onClick={() => wantToChange()} outline color="primary" size="sm">Change Password</Button>{' '}
                </div>
            :
                <Row> {/* NORMAL */}
                    {/* Left - Prof Pic, name, and basic info */}
                    <Col xs="10">
                        <Media>
                            <Media left href="#">
                                {user.profilePicture === "" ?                                                
                                    <Button 
                                        disabled 
                                        style={{borderRadius: 10, fontSize: 60, marginTop: '10%', paddingLeft: 30, paddingRight: 30, height: 160, width: 160}}>
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
                                    <p>Account Balance: ${String(user.accountBalance)}</p>
                                </div>
                            </Media>
                        </Media>
                    </Col>
                    {/* Right - Edit Profile button */}
                    <Col xs="2" id="right">
                        <Button onClick={() => wantToEdit()} outline color="primary" size="sm">Edit Profile</Button>{' '}
                        &nbsp;&nbsp;
                        <Button onClick={() => wantToChange()} outline color="primary" size="sm">Change Password</Button>{' '}
                    </Col>
                </Row>
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
                {user.bio ?
                    <p>{user.bio}</p>
                    :
                    <p>User bio</p>
                }
                <h4>Contact Info</h4>
                {/* Phone */}
                <Row>
                    <Col xs="auto"><p>Phone:</p></Col>
                    {user ?
                        <Col xs="auto"><p>{formatPhoneNumber(user.phoneNumber)}</p></Col>
                        :
                        <Col xs="auto"><p>###-###-####</p></Col>
                    }  
                </Row>
                {/* Email */}
                <Row>
                    <Col xs="auto"><p>Email:</p></Col>
                    {user ?
                        <Col xs="auto"><p>{user.email}</p></Col>
                        :
                        <Col xs="auto"><p>user@email.com</p></Col>
                    }
                </Row>
                {/* Right - Location */}
                {user ?
                    <div>
                        <h4>Address</h4>
                        {user.address === '' ?
                            <p>No Address Set</p>
                            :
                            <p>{user.address}</p>
                        }
                    </div> : <div></div>
                }
                {/* Job Categories */}
                <h4>Job Categories</h4>
                {/* Liked Categories */}
                <Row>
                    <Col xs="auto"><p>Interested:</p></Col>
                    {user.email !== '' ?
                        <Col xs="auto"><p>{user.mostInterestedCategory}</p></Col>
                        :
                        <Col xs="auto"><p>Interested</p></Col>
                    }
                </Row>
                {/* Disliked Categories */}
                <Row>
                    <Col xs="auto"><p>Disinterested:</p></Col>
                    {user.email !== '' ?
                        <Col xs="auto"><p>{user.leastInterestedCategory}</p></Col>
                        :
                        <Col xs="auto"><p>Disinterested Categories</p></Col>
                    }
                </Row>
                <Row>
                    <Col>
                        <h2 style={{ fontWeight: 'bold' }}>Posted Tasks</h2>
                        <hr />
                        <div style={{width: 300}}><PostTasksCarousel /></div>
                    </Col>
                </Row>
                                
                <Row>
                    <Col>
                        <h2 style={{ fontWeight: 'bold' }}>Tasks Completed</h2>
                        <hr />
                        <div style={{width: 300}}><TasksCompletedCarousel /></div>
                    </Col>
                </Row>
            </div>
            :
            <div>
            <Row> {/* NORMAL */}
                {/* Right - About */}
                <Col>
                    <h2 style={{ fontWeight: 'bold' }}>About</h2>
                    <hr />
                    <Row>
                        {/* Left - About Info */}
                        <Col xs="6">
                            <h4>Bio</h4>
                            {user.bio ?
                                <p>{user.bio}</p>
                                :
                                <p>User bio</p>
                            }
                            <h4>Contact Info</h4>
                            {/* Phone */}
                            <Row>
                                <Col xs="auto"><p>Phone:</p></Col>
                                {user.phoneNumber !== '' ?
                                    <Col xs="auto"><p>{formatPhoneNumber(user.phoneNumber)}</p></Col>
                                    :
                                    <Col xs="auto"><p>###-###-####</p></Col>
                                }  
                            </Row>
                            {/* Email */}
                            <Row>
                                <Col xs="auto"><p>Email:</p></Col>
                                {user.email !== '' ?
                                    <Col xs="auto"><p>{user.email}</p></Col>
                                    :
                                    <Col xs="auto"><p>youremail@email.com</p></Col>
                                }
                            </Row>
                        </Col>
                        {/* Right - Location */}
                        <Col xs="6">
                            {user ?
                                <div>
                                    <h4>Address</h4>
                                    {user.address === '' ?
                                        <p>No Address Set</p>
                                        :
                                        <p>{user.address}</p>
                                    }
                                </div> : <div></div>
                            }
                            {/* Job Categories */}
                            <h4>Job Categories</h4>
                            {/* Liked Categories */}
                            <Row>
                                <Col xs="auto"><p>Interested:</p></Col>
                                {user.email !== '' ?
                                    <Col xs="auto"><p>{user.mostInterestedCategory}</p></Col>
                                    :
                                    <Col xs="auto"><p>Interested</p></Col>
                                }
                            </Row>
                            {/* Disliked Categories */}
                            <Row>
                                <Col xs="auto"><p>Disinterested:</p></Col>
                                {user.email !== '' ?
                                    <Col xs="auto"><p>{user.leastInterestedCategory}</p></Col>
                                    :
                                    <Col xs="auto"><p>Disinterested Categories</p></Col>
                                }
                            </Row>
                        </Col>
                    </Row>
                </Col>
                
            </Row>
            <br />
            <Row>
                <Col>
                    <h2 style={{ fontWeight: 'bold' }}>Posted Tasks</h2>
                    <hr />
                    <div style={{width: 300}}><PostTasksCarousel/></div>
                </Col>
                <Col>
                    <h2 style={{ fontWeight: 'bold' }}>Tasks Completed</h2>
                    <hr />
                    <div style={{width: 300}}><TasksCompletedCarousel /></div>
                </Col>
            </Row>
            </div>
            
            }
        </Container>
    )
}

export default MainProfile;