import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../Contexts/APIContext';
import {
    Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown,
    DropdownToggle, DropdownMenu, DropdownItem, UncontrolledCollapse, Container, Badge, ListGroup, ListGroupItem
} from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { MdPerson } from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IconContext } from 'react-icons';
import axios from 'axios';
import APIContext from '../Contexts/APIContext';

interface NavProps {
    redirect: boolean
}

type user = {
    name: string
}

const Navigation = ({ history }: RouteComponentProps, { redirect }: NavProps) => {
    const url = useContext(APIContext);
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<user>();

    const token = localStorage.getItem('access_token');
    useEffect(() => {

        axios.get(url + 'me/getProfile',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                //console.log(response.data);
                setUser(response.data)
            })
            .catch(error => {
                if (!redirect) {
                    localStorage.removeItem('access_token');
                    history.push('/');
                }
            });
    }, [history])

    const toggleNav = () => {
        setIsOpen(!isOpen);
        console.log(isOpen)
    };

    const signOut = () => {
        localStorage.removeItem('access_token');
        {/* Removes token and refreshes page to refresh AuthContext */ }
        history.push('/');
        window.location.reload(false);
    }

    const isMobile = window.innerWidth < 1000;

    if (isMobile) {return (
        <div>
            <Navbar color="dark" dark expand="md">
                <NavbarBrand href="/" className={'brand'}>OddJobs</NavbarBrand>
                {token ?
                <div style={{float: 'right', marginRight: '10px'}}>
                    <IconContext.Provider value={{ size: '2em' }}><GiHamburgerMenu style={{ color: 'white'}} id="toggler" /></IconContext.Provider>
                </div> : <div></div>}
            </Navbar>

            {/* Dropdown */}
            {token ?
            <UncontrolledCollapse toggler="#toggler">
                <ListGroup flush>
                    <ListGroupItem tag="a" href="/tasks" className="centered" action><h5 style={{fontWeight: 'bold'}}>Task Board</h5></ListGroupItem>
                    <ListGroupItem tag="a" href="/listtask" className="centered" action><h5 style={{fontWeight: 'bold'}}>List a Task</h5></ListGroupItem>
                    <ListGroupItem tag="a" href="/survey" className="centered" action><h5 style={{fontWeight: 'bold'}}>Surveys</h5></ListGroupItem>

                    <ListGroupItem tag="a" href="/profile" className="centered" action><h5 style={{fontWeight: 'bold'}}>Profile</h5></ListGroupItem>
                    <ListGroupItem tag="a" href="/myTasks" className="centered" action><h5 style={{fontWeight: 'bold'}}>My Tasks</h5></ListGroupItem>
                    <ListGroupItem tag="a" href="" onClick={signOut} className="centered" action><h5 style={{fontWeight: 'bold'}}>Sign Out</h5></ListGroupItem>
                </ListGroup>
            </UncontrolledCollapse> : <div></div>}
        </div>
    )} else {return (
        <Navbar color="dark" dark expand="md">
            <NavbarBrand href="/" className={'mx-auto brand'}>OddJobs</NavbarBrand>
            <NavbarToggler onClick={toggleNav} />
            <Collapse isOpen={isOpen} navbar={true}>
                {/* Checks if you're logged in and renders the rest of navbar if true */}
                {token ?
                    <Nav navbar className="mr-auto">
                        <NavItem>
                            <NavLink href="/tasks">Task Board</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/listtask">List a Task</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/survey">Surveys</NavLink>
                        </NavItem>
                    </Nav>
                    : <Nav navbar className='mr-auto'></Nav>
                }


                {/* Right side of nav bar */}
                <UncontrolledDropdown navbar inNavbar>
                    <DropdownToggle nav caret style={{ color: 'white', fontWeight: 'bolder' }}>
                        <IconContext.Provider value={{ size: '1.5em' }}>
                            <MdPerson />{user?.name}
                        </IconContext.Provider>
                    </DropdownToggle>
                    {/* Checks if signed in, then conditionally renders different menu */}
                    {token ?
                        <DropdownMenu right>
                            <DropdownItem href="/profile">
                                Profile Home
                            </DropdownItem>
                            <DropdownItem divider />
                            {/* <DropdownItem href="/upcomingtasks">
                                Upcoming Tasks
                            </DropdownItem> */}
                            <DropdownItem href="/myTasks">
                                My Tasks
                            </DropdownItem>
                            <DropdownItem onClick={signOut}>
                                Sign Out
                            </DropdownItem>
                        </DropdownMenu>
                        :
                        <DropdownMenu right>
                            <DropdownItem href="/">
                                Sign In
                            </DropdownItem>
                        </DropdownMenu>
                    }
                </UncontrolledDropdown>
            </Collapse>
        </Navbar>
    );}
}

export default withRouter(Navigation);