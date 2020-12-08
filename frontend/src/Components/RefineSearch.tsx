import React, { useState, useContext } from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { Field, Formik } from 'formik';

const RefineSearch = (props) => {    
    return (
        <div className="centered" style={{background: "#d6d6d6", height: "auto"}}>
            <Formik initialValues={{ categoryId: 0, title: "", duration: 0, minPrice: 0, maxPrice: 999 }} onSubmit={data => console.log(data)}>
                <Form inline style={{margin: '1rem'}} >
                    {/* Title Search Bar */}
                    <FormGroup>
                        <Label for="search"><h5><b>Search&nbsp;</b></h5></Label>{' '}
                        <Field type="text" name="title" id="title" placeholder="Task Title" />
                    </FormGroup>

                    {/* Select Task Category */}
                    <FormGroup>
                        <Label for="categoryId"><h5>&nbsp;&nbsp;&nbsp;<b>Task Category&nbsp;</b></h5></Label>
                        <Field type="select" name="categoryId" as={Input}>
                            <option value="0" selected>Select Category</option>
                            <option value="1">Yard Work</option>
                            <option value="2">Transportation</option>
                            <option value="3">Cleaning</option>
                            <option value="4">Moving</option>
                            <option value="5">Care-Taking</option>
                            <option value="6">Cooking</option>
                            <option value="7">Other</option>
                        </Field>
                    </FormGroup>

                    {/* Select Min/Max Price */}
                    <FormGroup>
                        <Label for="minPrice"><h5>&nbsp;&nbsp;&nbsp;<b>Min Price&nbsp;</b> </h5></Label>
                        <Field type="text" name="minPrice" id="minPrice" placeholder="$" as={Input} style={{width: 75}} />
                    </FormGroup>

                    <FormGroup>
                        <Label for="maxPrice"><h5>&nbsp;&nbsp;&nbsp;<b>Max Price&nbsp;</b> </h5></Label>
                        <Field type="text" name="maxPrice" id="maxPrice" placeholder="$$$" as={Input} style={{width: 75}} />
                    </FormGroup>

                    {/* Submit Button */}
                    &nbsp;&nbsp;&nbsp;
                    <Button color="danger" type="submit">Refine Search</Button>
                </Form>
            </Formik>
        </div>
    );
  }
  
  export default RefineSearch