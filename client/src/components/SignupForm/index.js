import React from 'react';
import { TextField, Button, Paper, Typography } from '@material-ui/core';
import PersonAdd from '@material-ui/icons/PersonAdd'
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import './index.css'

import axios from 'axios'

const styles = {
    input: {
        "width": "300px",
        "margin-top": "15px"
    },
    personAddIcon: {
        "font-size": "35px",
    },
    button: {
        "width": "346px",
        color: "white",
        "background-color": "lightskyblue",
        "margin-bottom": "30px",
        '&:hover': {
            "background-color": "royalblue"
        }
    },
    form: {
        "display": "table",
        "padding": "30px"
    },
    message: {
        "color": "green",
        "margin-top": "10px"
    }
}

class SignupForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            loading: false,
            message: '',
            errors: {}
        }
        this.handleKeyChange = this.handleKeyChange.bind(this)
        this.handleSignup = this.handleSignup.bind(this)
    }
    handleKeyChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }
    handleSignup() {
        this.setState({loading: true})
        const userData = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        }
        axios.post('/api/signup', userData)
            .then((res) => {
                this.setState({
                    message: res.data,
                    loading: false
                })
            })
            .catch((err) => {
                this.setState({
                    errors: err.response.data,
                    loading: false
                })
            }) 
    }
    render() {
        const { classes } = this.props
        const { loading, message, errors } = this.state
        return (
            <Paper className = {classes.form} elevation = {6}>
                <div className = "flexContainer">
                    <PersonAdd className = {classes.personAddIcon}/>
                    <h1 className = "signup">Signup</h1>
                </div>
                    <TextField 
                        onChange = {this.handleKeyChange} 
                        label = "Email" 
                        name = "email"
                        helperText = {errors.email}
                        error = {errors.email ? true : false}
                        className = {classes.input}
                        disabled = {loading}
                    />
                    <br/>
                    <TextField 
                        onChange = {this.handleKeyChange} 
                        label = "Username" 
                        name = "username"
                        helperText = {errors.username}
                        error = {errors.username ? true : false}
                        className = {classes.input}
                        disabled = {loading}
                    />
                    <br/>
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
                    <br/>
                    <TextField 
                        type = "password"
                        onChange = {this.handleKeyChange} 
                        label = "Repeat your password" 
                        name = "confirmPassword"
                        helperText = {errors.confirmPassword}
                        error = {errors.confirmPassword ? true : false}
                        className = {classes.input}
                        disabled = {loading}
                    />
                    {message ? (
                        <Typography variant="body2" className={classes.message}>
                            {message}
                        </Typography>
                    ) : ("")}
                    <br/>
                    <br/>
                    <Button 
                        variant = "contained" 
                        className = {classes.button} 
                        onClick = {this.handleSignup} 
                        disabled = {loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Sign up"
                        )}
                    </Button>
            </Paper>
        );
    }
}

export default withStyles(styles)(SignupForm)