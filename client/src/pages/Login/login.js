import React from 'react'
import LoginForm from '../../components/LoginForm'
import './index.css'

class Login extends React.Component{
    render() {
        return(
            <div className = "loginPage">
                <img src = "/assets/icons/icon2.png" className = "connectIcon"></img>
                <div className = "name">REACONNECT</div>
                <LoginForm history = {this.props.history}/>
                {/* <a>Forgot your password ?</a> */}
            </div>
        )
    }
}

export default Login;