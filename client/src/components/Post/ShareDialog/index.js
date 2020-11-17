import React from 'react'
import { 
    TextField, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Button, 
    CircularProgress, 
    IconButton,
    Tooltip,
    Typography
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = {
    dialog: {
        width: "450px",
        display: "flex",
        "flex-direction": "column",
        "align-items": "center"
    },
    inputField: {
        width: "400px"
    },
    success: {
        color: "green"
    }
}

class ShareDialog extends React.Component {
    render() {
        const { open, closeDialog, defaultValue, classes } = this.props
        return (
            <Dialog 
                open = {open} 
                onClose = {closeDialog}
                maxWidth = "sm"
            >
                <div className = {classes.dialog}>
                    <DialogContent 
                    >
                        <TextField
                            autoFocus
                            className = {classes.inputField}
                            margin="dense"
                            size = "medium"
                            defaultValue = {defaultValue}
                            fullWidth
                            id = "postUrl"
                        />
                    </DialogContent>
                    <Typography className = {classes.success}>
                        Post's link has been copied to clipboard 
                    </Typography>
                </div>
            </Dialog>
        )
    }
}

export default withStyles(styles)(ShareDialog)