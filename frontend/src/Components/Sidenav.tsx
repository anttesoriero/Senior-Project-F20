import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { FaUsers, FaTasks } from 'react-icons/fa';
import { MdReport,MdLocalOffer } from 'react-icons/md';
import { RiSurveyFill } from 'react-icons/ri';


const Sidenav = () => {
    return (
        <div>
            <h3 style={{ fontWeight: 'bolder', color: "#e0e0e0" }}>&nbsp;&nbsp;&nbsp;&nbsp;Admin</h3><hr />
            <Nav vertical className="justify-content-center">
                <NavItem>
                    <NavLink href="/adminUsers" style={{ fontWeight: 'bolder' }}>&nbsp;&nbsp;<FaUsers />&nbsp;Users</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/adminReports" style={{ fontWeight: 'bolder' }}>&nbsp;&nbsp;<MdReport />&nbsp;User Reports</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/adminTasks" style={{ fontWeight: 'bolder' }}>&nbsp;&nbsp;<FaTasks />&nbsp;Tasks</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/adminOffers" style={{ fontWeight: 'bolder' }}>&nbsp;&nbsp;<MdLocalOffer />&nbsp;Offers</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/adminSurveys" style={{ fontWeight: 'bolder' }}>&nbsp;&nbsp;<RiSurveyFill />&nbsp;Surveys</NavLink>
                </NavItem>
            </Nav>
        </div>
    );
}

export default Sidenav;