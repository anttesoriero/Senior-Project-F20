import React, { useState } from 'react'
import { Button, Col, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, InputGroup, InputGroupAddon } from 'reactstrap';
import { Field, Formik } from 'formik';

const RefineSearch = (props) => {    
    return (
        <div className="centered" style={{background: "#d6d6d6", height: "auto"}}>
            {/* <Formik initialValues={{ categoryId: 1, search: '', duration: 0 }} onSubmit={data => }> */}
            {/* Change "Input"'s to "Field"'s when Formik used */}
                <Form inline style={{margin: '1rem'}}>
                    {/* Title Search Bar */}
                    <FormGroup>
                        <Label for="search"><h5><b>Search&nbsp;</b></h5></Label>{' '}
                        <Input type="text" name="search" id="search" placeholder="Task Title" />
                    </FormGroup>

                    {/* Select Task Category */}
                    <FormGroup>
                        <Label for="categoryId"><h5>&nbsp;&nbsp;&nbsp;<b>Task Category&nbsp;</b></h5></Label>
                        <Input type="select" name="categoryId" as={Input}>
                            <option value="1" selected>Select Category</option>
                            <option value="2">Yard Work</option>
                            <option value="3">Transportation</option>
                            <option value="4">Cleaning</option>
                            <option value="5">Moving</option>
                            <option value="6">Care-Taking</option>
                            <option value="7">Cooking</option>
                        </Input>
                    </FormGroup>

                    {/* Select Duration */}
                    <FormGroup>
                        <Label for="duration"><h5>&nbsp;&nbsp;&nbsp;<b>Duration&nbsp;</b> </h5></Label>
                        <Input type="select" name="duration" id="duration">
                            <option selected>Select Duration</option>
                            <option value="30">{"< 30 Minutes"}</option>
                            <option value="45">{"< 45 Minutes"}</option>
                            <option value="60">{"< 60 Minutes"}</option>
                            <option value="90">{"< 90 Minutes"}</option>
                            <option value="120">{"< 120 Minutes"}</option>
                        </Input>
                    </FormGroup>

                    {/* Submit Button */}
                    &nbsp;&nbsp;&nbsp;
                    <Button color="danger">Refine Search</Button>
                </Form>
            {/* </Formik> */}
        </div>
    );
  }
  
  export default RefineSearch