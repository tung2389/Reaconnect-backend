import React from 'react';
import { Paper, Typography, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles' 

import axios from 'axios'

const styles = {
    paper: {
        padding : "25px 25px 75px 25px",
        "position": "relative",
        "left": "50%",
        "margin-top": "50px",
        "transform": "translate(-50%, 0%)",
		"display": "table"
    },
    error: {
        color: "red",
        "font-weight": "bold",
		"margin-bottom": "25px"
    },
    success: {
        color: "green",
        "font-weight": "bold",
		"margin-bottom": "25px"
    },
	progress: {
		"position": "relative",
        "left": "50%",
        "margin-top": "200px",
        "transform": "translate(-50%, 0%)",
	}
}
class Verify extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            message: '',
            errors: {}
        }
    }
    componentDidMount() {
        const { id } = this.props.match.params
        axios.get(`/api/verify/${id}`)
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
        const { classes} = this.props
        const { loading, message, errors } = this.state
        return(
            (loading) ? (
                <CircularProgress size={100} className = {classes.progress} />
            ) : (
                (errors.message) ? (
                    <Paper elevation = {6} className = {classes.paper}>
                        <Typography variant = "h5" className = {classes.error}>Error</Typography>
                        <Typography variant = "subtitle1">{errors.message}</Typography>
                    </Paper>
                ) : (
                    <Paper elevation = {6} className = {classes.paper}>
                        <Typography variant = "h5" className = {classes.success}>{message}</Typography>
                        <Typography variant = "subtitle1">Now you can login and connect with other people</Typography>
                    </Paper>
                )
            )
        )
    }
}

export default withStyles(styles)(Verify)