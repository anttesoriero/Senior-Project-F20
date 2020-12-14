import React, { useContext } from 'react'
import { Formik, Field, Form } from 'formik'
import { Container, Row, Col, FormGroup, Label, Input, Button, UncontrolledPopover, PopoverBody } from 'reactstrap'
import StateSelector from './StateSelector'
import axios from 'axios'
import APIContext from '../Contexts/APIContext'

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

type MyProfileEditProps = {
    user: userState,
    backToMain: Function,
    wantToEdit: Function,
}

const MyProfileEdit = ({user, backToMain, wantToEdit}: MyProfileEditProps) => {
    const url = useContext(APIContext);
    const token = localStorage.getItem('access_token');
    
    const editProfile = async (data) => {
        const address = data.address + ', ' + data.city + ', ' + data.state + ', ' + data.zip
        
        const userInfo = {
            firstName: data.name.split(' ')[0],
            lastName: data.name.split(' ')[1],
            preferredName: data.preferredName,
            phoneNumber: data.phoneNumber,
            bio: data.bio,
        }

        if (data.address !== '') {
            userInfo['address'] = address
        }

        await axios.put(url + 'me/editInformation', userInfo,
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                backToMain()
                window.location.reload(false);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const deleteAccount = async () => {
        await axios.delete(url + 'me/deleteAccount',
        { headers: { Authorization: `Bearer ${token}`} })
        .then(response => {
            console.log(response.data);
            window.location.reload(false);
        })
        .catch(error => {
            console.log(error);
        });
    }
    
    var address = user.address.split(', ')

    return (
        <Container onSubmit={editProfile}>
            <h1 id="centered" style={{ fontWeight: 'bold' }}>Edit Profile</h1>
            <br />
            <div className="centered">
                <Formik initialValues={{ 
                        name: user.name, 
                        preferredName: user.preferredName, 
                        phoneNumber: user.phoneNumber, 
                        address: address[0],
                        city: address[1],
                        state: address[2],
                        zip: address[3]
                    }} onSubmit={data => editProfile(data)}
                >
                    <Form>
                        {/* Row 1 - Change Name */}
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="name"><h4>Full Name</h4></Label>
                                    <Field name='name' type='text' placeholder={user.name} as={Input} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="preferredName"><h3>Preferred Name</h3></Label>
                                    <Field name='preferredName' type='text' placeholder={user.preferredName} as={Input} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <hr />

                        {/*Change email and preferred name */}
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="bio"><h4>Bio</h4></Label>
                                    <Field name='bio' type='textarea' placeholder={user.bio} as={Input} />
                                </FormGroup>        
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="phoneNumber"><h4>Phone Number</h4></Label>
                                    <Field name='phoneNumber' type='text' placeholder={user.phoneNumber} as={Input} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="address"><h4>Address</h4></Label>
                                    <Field type="text" name="address" id="address" placeholder={address[0]} as={Input} />
                                </FormGroup>
                            </Col>
                        </Row>

                        {/* Row 5 - City - State - Zip */}
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="city"><h4>City</h4></Label>
                                    <Field type="text" name="city" id="city" placeholder={address[1]} as={Input} />
                                </FormGroup>
                            </Col>
                            <Col md="4">
                                <FormGroup>
                                    <Label for="state"><h4>State</h4></Label>
                                    <StateSelector />
                                </FormGroup>
                            </Col>
                            <Col md="2">
                                <FormGroup>
                                    <Label for="zip"><h4>Zip</h4></Label>
                                    <Field type="text" name="zip" id="zip" placeholder={address[3]} as={Input} />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            {/*Account deletion*/}
                            <Col>
                                <h3 style={{ fontWeight: 'bold' }}>Delete Account</h3>
                                <hr />
                                {/* <Button className="centered" color="danger" size="sm" >Delete Account</Button> */}
                                <Button color="danger" size="sm" id="confirmDelete" type="button" outline>Delete Account</Button>
                            </Col>
                            <UncontrolledPopover placement="bottom" target="confirmDelete" style={{padding: 10}}>
                                <h3>Are you sure?</h3>
                                <PopoverBody>This cannot be undone</PopoverBody>
                                <Button color="danger" size="sm" type="submit" onClick={() => deleteAccount()}>Confirm</Button>
                                <br />
                            </UncontrolledPopover>
                        </Row>

                        <br />
                        <br />
                        <Row className='centered'>
                            <div className="centered"><Button color="primary" size="md" type="submit" onSubmit={editProfile}>Save Changes</Button></div>
                            &nbsp;&nbsp;
                            <div className="centered"><Button color="secondary" size="md" type="submit" onClick={() => wantToEdit()}>Cancel</Button></div>
                        </Row>
                    </Form>
                </Formik>
            </div>
        </Container>
    )
}

export default MyProfileEdit;