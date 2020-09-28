import React, { useState } from 'react';
import {RouteComponentProps, withRouter } from 'react-router-dom';
import { Container, Form, FormGroup, Input, Label, Button } from 'reactstrap';
import Navigation from '../Components/Navigation';
import axios from 'axios';

type event = {
    email: string,
    password: string
};

const LandingPage = ({history}: RouteComponentProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = event => {
        const data = new FormData(event.target)
        console.log(data);
        axios.post('https://futurfits-api.herokuapp.com/api/v1/user/login', {
            email: data.get('email'),
            password: data.get('password')
          })
          .then(function (response) {
            history.push('/profile')
            console.log(response);
          })
          .catch(function (error) {
            console.log(data);
          });
        
    }

    return(
        <div>
            <Navigation/>
            <br/>
            <Container>
                <div>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="exampleEmail">Email</Label>
                            <Input type="email" name="email" placeholder="email@email.com" onChange={event =>setEmail(event.target.value)} required/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="examplePassword">Password</Label>
                            <Input type="password" name="password" placeholder="password" onChange={event =>setPassword(event.target.value)} required/>
                        </FormGroup>
                        <FormGroup className='centered'>
                            <Button type='submit'>Sign In</Button>
                        </FormGroup>
                    </Form>
                </div>
            </Container>
        </div>
    )
}

export default withRouter(LandingPage);