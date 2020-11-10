import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { AiFillDashboard } from 'react-icons/ai';
import { FaUsers, FaTasks } from 'react-icons/fa';


const Sidenav = () => {
    return (
        <div>
            <h3 style={{ fontWeight: 'bolder', color: "#e0e0e0" }}>&nbsp;Administrator</h3><hr />
            <Nav vertical className="justify-content-center">
                <NavItem>
                    <NavLink href="/adminDash" style={{ fontWeight: 'bolder' }}><AiFillDashboard />&nbsp;Dashboard</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/adminUsers" style={{ fontWeight: 'bolder' }}><FaUsers />&nbsp;Users</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/adminTasks" style={{ fontWeight: 'bolder' }}><FaTasks />&nbsp;Tasks</NavLink>
                </NavItem>
            </Nav>
        </div>
    );
}

export default Sidenav;