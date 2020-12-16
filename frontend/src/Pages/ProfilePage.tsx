import React, { useEffect, useState, useContext } from 'react';
import Navigation from '../Components/Navigation';
import { Container, Row, Col, Button, Media, FormGroup, Input, Label, PopoverBody, UncontrolledPopover } from 'reactstrap';
import Footer from "../Components/Footer";
import axios from 'axios';
import 'reactjs-popup/dist/index.css';
import { Formik, Form, Field } from 'formik';
import APIContext from '../Contexts/APIContext';
import StateSelector from '../Components/StateSelector';
import MainProfile from '../Components/Profile_MainProfile';
import MyProfileEdit from '../Components/Profile_Edit';
import ProfileChangePassword from '../Components/Profile_ChangePassword';

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

const userInfo = {
    email: "",
    name: "",
    preferredName: "",
    accountBalance: 0,
    phoneNumber: "",
    bio: "",
    profilePicture: "",
    address: "",
    posterRating: null,
    workerRating: null,
    mostInterestedCategory: "",
    leastInterestedCategory: ""
}

const ProfilePage = () => {
    const url = useContext(APIContext);
    const token = localStorage.getItem('access_token');
    const isMobile = window.innerWidth < 1000;

    const [user, setUser] = useState<userState>(userInfo);
    const [initials, setInitials] = useState<String>("");
    const [pageState, setPageState] = useState<String>("main profile");

    const getUser = async () => {
        {/* Example of sending authorized request. Get can take multiple parameters, in this case 2.
            First one is the endpoint and second is the authorization headers */}
        await axios.get(url + 'me/getProfile',
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

    const backToMain = () => {
        setPageState("main profile")
    }

    const wantToEdit = () => {
        setPageState("edit profile")
    }

    const wantToChange = () => {
        setPageState("change password")
    }

    useEffect(() => {
        getUser();
    }, []);


    return (
        <div>
            <Navigation />

            {(() => {
                switch (pageState) {
                    case 'main profile':
                        return (<MainProfile isMobile={isMobile} user={user} initials={initials} wantToChange={wantToChange} wantToEdit={wantToEdit} />)
                    case 'edit profile':
                        return (<MyProfileEdit user={user} backToMain={backToMain} wantToEdit={wantToEdit}/>)
                    case 'change password':
                        return (<ProfileChangePassword backToMain={backToMain} />)
                    default:
                        return null;
                }
            })()}
            <br />
            <Footer />
        </div >
    );
}

export default ProfilePage;