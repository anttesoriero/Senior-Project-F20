import React, { useContext, useState } from 'react';
import AuthContext from '../Contexts/AuthContext';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown,
    DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { MdPerson } from 'react-icons/md';
import { IconContext } from 'react-icons';

const Navigation = ({history}: RouteComponentProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNav = () => setIsOpen(!isOpen);

    const signOut = () => {
        localStorage.removeItem('access_token');
        {/* Removes token and refreshes page to refresh AuthContext */}
        history.push('/profile');
        window.location.reload(false);
    }

    const contextType = useContext(AuthContext);

    return (
        <Navbar color="dark" dark expand="md">
            <NavbarBrand href="/" className={'mx-auto brand'}>OddJobs</NavbarBrand>
            <NavbarToggler onClick={toggleNav} />
            <Collapse isOpen={isOpen} navbar>
                {/* Checks if you're logged in and renders the rest of navbar if true */}
                {contextType ? 
                    <Nav navbar className="mr-auto">
                        <NavItem>
                            <NavLink href="/taskboard">Task Board</NavLink>
                        </NavItem>
                        {/*<NavItem>
                            <NavLink href="/profile">Profile</NavLink>
                        </NavItem>*/}
                        <NavItem>
                            <NavLink href="/findtasks">Find a Task</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/listtasks">List a Task</NavLink>
                        </NavItem>
                    </Nav>
                    : <Nav navbar className='mr-auto'></Nav>
                }
                

                {/* Right side of nav bar */}
                <UncontrolledDropdown navbar inNavbar>
                    <DropdownToggle nav caret style={{color: 'white', fontWeight: 'bolder'}}>
                        <IconContext.Provider value={{ size: '1.5em' }}>
                            <MdPerson/>Profile
                        </IconContext.Provider>
                    </DropdownToggle>
                    {/* Checks if signed in, then conditionally renders different menu */}
                    {contextType ?                     
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