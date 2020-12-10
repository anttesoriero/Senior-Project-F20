import React, { useEffect, useState, useContext } from 'react'
import { Button, Row, Col } from 'reactstrap';
import Sidenav from '../Components/Sidenav';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import APIContext from '../Contexts/APIContext';

type survey = {
    active: boolean,
    answerA: string,
    answerB: string,
    answerC: string,
    answerD: string,
    answerE: string,
    answerF: string,
    question: string,
    surveyId: number,
    type: string,
}

const AdminSurvey = () => {
    let a: survey[] = []
    const url = useContext(APIContext);

    const [surveys, setSurveys] = useState(a);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getSurveys() {
            await axios.post(url + 'admin/getAllSurveys', {
                adminPassword: sessionStorage.getItem('admin_pass')
            })
                .then(function (response) {
                    console.log(response.data);
                    setSurveys(response.data.surveys);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        getSurveys();
    }, [])

    return (
        <div>
            <Row>
                <Col className='sidenav' xs='2'>
                    <Sidenav />
                </Col>
                <Col style={{overflow: 'scroll'}}>
                    <DataTable 
                        title='Tasks'
                        data={surveys}
                        columns={[
                            {
                                name: 'Survey ID',
                                selector: 'surveyId',
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Type',
                                selector: 'type',
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Active',
                                selector: s => s.active.toString(),
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Question',
                                selector: 'question',
                                sortable: true,
                                grow: 1.5
                            },
                            {
                                name: 'Answer A',
                                selector: 'answerA',
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Answer B',
                                selector: 'answerB',
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Answer C',
                                selector: 'answerC',
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Answer D',
                                selector: 'answerD',
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Answer E',
                                selector: 'answerE',
                                sortable: true,
                                grow: .5
                            },
                            {
                                name: 'Answer F',
                                selector: 'answerF',
                                sortable: true,
                                grow: .5
                            },
                        ]} striped={true} highlightOnHover={true} progressPending={loading}/>
                </Col>
            </Row>
        </div>
    );
}

export default AdminSurvey;