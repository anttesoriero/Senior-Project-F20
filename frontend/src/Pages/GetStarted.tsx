import React from 'react';
import Navigation from '../Components/Navigation';
import { Button, Container, Row } from 'reactstrap';
import Footer from "../Components/Footer";

const GetStarted = () => {
    
    return (
        <div>
            <Navigation />

            <Container>
                <h1 className="centered">Get Started</h1>
                

                <h4>New to the site? Get started with OddJobs here, and find out all you need to know about using the site! </h4>
                <br />

                <h3><b>FAQ</b></h3>
                <hr />
                <h4><b>How do I make an account?</b></h4>
                <h5>Sign up or log in on our <a href="/">Home Page</a></h5>
                
                <h4><b>Where can I list a new task?</b></h4>
                <h5>You can list new tasks that you want completed on the <a href="/listtask">Listing Page</a></h5>

                <h4><b>I want to make some extra cash. How do I find tasks to complete?</b></h4>
                <h5>Find new tasks on the <a href="/tasks">Task Board</a>, and earn some extra cash!</h5>
                
                <h4><b>How old do I need to be to complete tasks?</b></h4>
                <h5>OddJobs required all users to be 18 or older. Find out more in our <a href="/terms">Terms of Service</a></h5>

                <h4><b>I see a notification about cookies. What does this mean?</b></h4>
                <h5>Cookies are used to better your experience on the site. You can learn more from our <a href="/privacy">Privacy Policy</a></h5>

                <h4><b>I keep taking surveys on the site. What is this information used for, and why do you need it?</b></h4>
                <h5>We use survey information to better your experience. You can learn more from our <a href="/privacy">Privacy Policy</a></h5>
                
                <h4><b>Does OddJobs take a fee from completed jobs?</b></h4>
                <h5>
                    Yes. For every task completed, OddJobs has a 2% service fee, which will be deducted from the workers total. For example, 
                    if the pay rate is $10, the lister will pay $10, and the worker will recieve $9.80. Find out more in our <a href="/terms">Terms of Service</a>
                </h5>
                
                <h4><b>Who made OddJobs?</b></h4>
                <h5>Meet our team and learn <a href="/about">About Us</a></h5>

                <hr />
                <h4 className="centered">Need more help?</h4>
                <br/>
                <Row className="centered"><Button href="/contact" outline color="info">Contact Us</Button></Row>
                
            </Container>

            <Footer />

        </div>
    );
}

export default GetStarted;