import React from 'react'
import SignupForm from '../../components/SignupForm'
import './index.css'

class Signup extends React.Component{
    render() {
        return(
            <div className = "signupPage">
                <div className = "container">
                    <div className = "description">
                    	Signup to join our network
                    </div>
                    <SignupForm/>
                </div>
            </div>
        );
    }
}

export default Signup;