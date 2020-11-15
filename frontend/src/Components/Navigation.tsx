import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../Contexts/AuthContext';
import {
    Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown,
    DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { MdPerson } from 'react-icons/md';
import { IconContext } from 'react-icons';
import axios from 'axios';

interface NavProps {
    redirect: boolean
}

const Navigation = ({ history }: RouteComponentProps, { redirect }: NavProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const token = localStorage.getItem('access_token');
    useEffect(() => {

        axios.get('http://ec2-54-165-213-235.compute-1.amazonaws.com:80/me/getProfile',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                if (!redirect) {
                    localStorage.removeItem('access_token');
                    history.push('/');
                }
            });
    }, [history])

    const toggleNav = () => setIsOpen(!isOpen);

    const signOut = () => {
        localStorage.removeItem('access_token');
        {/* Removes token and refreshes page to refresh AuthContext */ }
        history.push('/');
        window.location.reload(false);
    }

    const contextType = useContext(AuthContext);

    return (
        <Navbar color="dark" dark expand="md">
            <NavbarBrand href="/" className={'mx-auto brand'}>OddJobs</NavbarBrand>
            <NavbarToggler onClick={toggleNav} />
            <Collapse isOpen={isOpen} navbar>
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
                            <MdPerson />Profile
                        </IconContext.Provider>
                    </DropdownToggle>
                    {/* Checks if signed in, then conditionally renders different menu */}
                    {token ?
                        <DropdownMenu right>
                            <DropdownItem href="/profile">
                                Profile Home
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem href="/upcomingtasks">
                                Upcoming Tasks
                            </DropdownItem>
                            <DropdownItem href="/offers">
                                Offers
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
    );
}

export default withRouter(Navigation);