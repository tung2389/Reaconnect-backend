import React from 'react';
import { TextField, Button, Paper, Typography } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import Forward from '@material-ui/icons/Forward';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import './index.css';

import { connect } from 'react-redux'
import { login } from '../../redux/actions/userActions'

const styles = {
    input: {
        "margin-left": "15px",
        "width": "300px"
    },
    forwardIcon: {
        "font-size": "35px",
    },
    form: {
        "display": "table",
        "padding": "60px 60px 0px 60px",
        "position": "relative",
        "left": "50%",
        "top": "50%",
        "transform": "translate(-50%, 0%)"
    },
    button: {
        "width": "346px",
        "margin-bottom": "30px",
    },
    generalerrors: {
        "color": "red",
        "margin-top": "10px"
    },
    signup: {
        "color": "blue"
    }
}

class LoginForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loading: false,
            errors: {}
        }
        this.handleKeyChange = this.handleKeyChange.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
    }
    handleKeyChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleLogin() {
        this.setState({loading: true})
        const userData = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.login(userData, this.props.history)
            .catch((err) => { // No need to set loading false on success because the page is unmouted
                this.setState({
                    errors: err.response.data,
                    loading: false
                })
            })
    }
    render() {
        const { classes } = this.props
        const { loading, errors } = this.state
        return(
            <Paper className = {classes.form} elevation = {4}>
                <div className = "flexContainer">
                    <Forward className = {classes.forwardIcon}/>
                    <h1 className = "login">Login</h1>
                </div>
                <div className = "flexContainer">
                    <AccountCircle/>
                    <TextField 
                        onChange = {this.handleKeyChange} 
                        label = "Email"
                        name = "email"
                        helperText = {errors.email}
                        error = {errors.email ? true : false}
                        className = {classes.input}
                        disabled = {loading}
                    />
                </div>
                <br/>
                <div className = "flexContainer">
                    <Lock/>
                    <TextField 
                        type = "password"
                        onChange = {this.handleKeyChange} 
                        label = "Password"
                        name = "password"
                        helperText = {errors.password}
                        error = {errors.password ? true : false}
                        className = {classes.input}
                        disabled = {loading}
                        />
                </div>
                {errors.general ? (
                    <Typography variant="body2" className={classes.generalerrors}>
                        {errors.general}
                    </Typography>
                ) : ("")}
                <br/>
                <br/>
                <Button 
                    color = "primary" 
                    variant = "contained" 
                    className = {classes.button} 
                    onClick = {this.handleLogin} 
                    disabled = {loading}
                >
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        "Login"
                    )}
                </Button>
                <div className = "ask">
                    Not have an account yet ? 
                    <Button className = {classes.signup} onClick = {() => this.props.history.push("/signup")}>
                        Sign up
                    </Button>
                </div>
            </Paper>
        );
    }
}

const mapActionsToProps = {
    login
}

export default connect(
    null,
    mapActionsToProps,
)(withStyles(styles)(LoginForm))