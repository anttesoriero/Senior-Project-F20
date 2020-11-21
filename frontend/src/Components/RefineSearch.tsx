import React, { useState } from 'react'
import axios from 'axios';
import PlaceholderImage from "../Styles/Images/placeholder.jpg"
import { Button, Col, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, InputGroup, InputGroupAddon } from 'reactstrap';
import CategoryDropdown from './CategoryDropdown';

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

                <Modal isOpen={modal} toggle={toggle} className={className} backdrop={backdrop} keyboard={keyboard} size="lg">
                    <ModalHeader toggle={toggle}><h4>Refine Search</h4></ModalHeader>
                    <ModalBody>
                        

                        <Row>
                            <Col>
                                <h4 className="centered">Pay Rate</h4>
                            </Col>
                            <Col>
                                <h4 className="centered">Category</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <InputGroup inline>
                                    <Col xs="5">
                                        {/* <InputGroupAddon addonType="prepend">$</InputGroupAddon> */}
                                        <Input type="number" 
                                            name="minPayRate" 
                                            id="minPayRate" 
                                            placeholder="Min" 
                                            min="15" />
                                    </Col>
                                    <Col xs="1">-</Col>
                                    <Col xs="5">
                                        {/* <InputGroupAddon addonType="prepend">$</InputGroupAddon> */}
                                        <Input type="number" 
                                            name="maxPayRate" 
                                            id="maxPayRate" 
                                            placeholder="Max" 
                                            min="15" />
                                    </Col>
                                </InputGroup>
                            </Col>
                            
                            <Col>
                            <FormGroup>
                                    <Input type="select" name="taskCategory" id="taskCategory">
                                            {/* "Select Category" is value=1 because "Yard Work" 
                                                keeps displaying first even though it's second.
                                                When calling the endpoint, the categoryId is substracted by one. */}
                                            <option value="1" selected disabled>Select Category</option>
                                            <option value="2">Yard Work</option>
                                            <option value="3">Transportation</option>
                                            <option value="4">Cleaning</option>
                                            <option value="5">Moving</option>
                                            <option value="6">Care-Taking</option>
                                            <option value="7">Cooking</option>
                                        {/* The Component below doesn't work */}
                                        {/* <CategoryDropdown categoryList={['SAMPLE USAGE','Educational','Fitness','IMPORT OTHERS FROM FULL LIST']} /> */}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>


                        <Row>
                            <Col>
                                <h4 className="centered">--</h4>
                            </Col>
                            <Col>
                                <h4 className="centered">Distance</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                
                            </Col>
                            
                            <Col>
                            <FormGroup>
                                    <Input type="select" name="distance" id="distance">
                                        <option selected>Select Distance</option>
                                        <option value="1">{"< 5 Miles"}</option>
                                        <option value="2">{"< 10 Miles"}</option>
                                        <option value="3">{"< 20 Miles"}</option>
                                        <option value="4">{"< 50 Miles"}</option>
                                        <option value="5">{"> 50 Miles"}</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        
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