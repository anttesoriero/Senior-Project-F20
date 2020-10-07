import React, {useState} from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
//import Register from "./Register";
import SignIn from './SignIn'

const AuthTabs = () => {
    const [selectedTab, setSelectedTab] = useState('tab-1');

    return (
        <Tabs selectedItem={selectedTab} onChange={setSelectedTab}>
            <TabList>
                <Tab item={'tab-1'} style={{color: '#000'}}>Log In</Tab>
                <Tab item={'tab-2'} style={{color: '#000'}}>Make an Account</Tab>
            </TabList>

            <TabPanel item={'tab-1'}>
                <SignIn/>
            </TabPanel>
            {/* <TabPanel item={'tab-2'}>
                <Register/>
            </TabPanel> */}
        </Tabs>
    );
}

export default AuthTabs;