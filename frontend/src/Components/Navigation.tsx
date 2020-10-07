import React, { useState } from 'react';

import { Button, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown,
    DropdownToggle, DropdownMenu, DropdownItem, NavbarText, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    const togglePop = () => setPopoverOpen(!popoverOpen);
    const toggleNav = () => setIsOpen(!isOpen);

    return (
        <Navbar color="dark" dark expand="md">
            <NavbarBrand href="/" className={'mx-auto brand'}>OddJobs</NavbarBrand>
            <NavbarToggler onClick={toggleNav} />
            <Collapse isOpen={isOpen} navbar>
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
                {/* <Button color="light" id="Popover1" type="button">Profile</Button> */}
                {/* <Popover
                    isOpen={popoverOpen}
                    target="Popover1"
                    toggle={togglePop}
                >
                    <PopoverHeader>Profile</PopoverHeader>
                    <PopoverBody>Hello user!</PopoverBody>
                    <div className="motto text-center">
                        <Button>Sign Out</Button>
                        <br />
                        <br />
                    </div>
                </Popover>               */}

                {/* Right side of nav bar */}
                <UncontrolledDropdown navbar inNavbar>
                    <DropdownToggle nav caret>
                        Profile
                    </DropdownToggle>
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
                    </DropdownMenu>
                </UncontrolledDropdown>
            </Collapse>
        </Navbar>
    );
}

export default Navigation;