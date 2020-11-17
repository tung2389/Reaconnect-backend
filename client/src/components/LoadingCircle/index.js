import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles'

const styles = {
    loading: {
        "position": "relative",
        "left": "50%",
        "margin-top": "200px",
        "transform": "translate(-50%, 0%)",
    }
}

const LoadingCircle = ({classes}) => (
    <CircularProgress size = {100} className = {classes.loading}/>
)

export default withStyles(styles)(LoadingCircle)