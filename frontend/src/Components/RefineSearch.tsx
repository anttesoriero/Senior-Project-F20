import React, { useState } from 'react'
import axios from 'axios';
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import { Button, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const RefineSearch = (props) => {
    {/* prop: {scrollBool: boolean} */}
    const {
        buttonLabel,
        className
      } = props;
    const [modal, setModal] = useState(false);
    const [backdrop, setBackdrop] = useState(true);
    const [keyboard, setKeyboard] = useState(true);

    const toggle = () => setModal(!modal);

    const changeKeyboard = e => {
    setKeyboard(e.currentTarget.checked);
    }
    
    
    
    return (
        <div style={{background: "#d6d6d6"}}>
            <Container style={{height: "45px"}}>
                <Form inline onSubmit={(e) => e.preventDefault()}>
                    
                    <FormGroup>
                        <Label for="searchBar"><h5><b>Search</b></h5></Label>{' '}
                        <Input type="text" name="searchBar" id="searchBar" placeholder="Task Title" />
                    </FormGroup>
                    <FormGroup className="mx-2" check>
                        <Label check><Input type="checkbox" checked={keyboard} onChange={changeKeyboard} /></Label>
                    </FormGroup>
                    {' '}
                    <Button color="danger" onClick={toggle}>Refine Search</Button>
                </Form>
                <Modal isOpen={modal} toggle={toggle} className={className} backdrop={backdrop} keyboard={keyboard}>
                    <ModalHeader toggle={toggle}><h4>Refine Search</h4></ModalHeader>
                    <ModalBody>
                        Form with multiple refinement options
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={toggle}>Refine</Button>{' '}
                        <Button color="secondary" onClick={toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </div>
    );
  }
  
  export default RefineSearch