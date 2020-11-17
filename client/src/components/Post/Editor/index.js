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
    Tooltip
} from '@material-ui/core'
import {
    Photo,
} from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

import ProfileImage from '../../ProfileImage'

import { connect } from 'react-redux'

const styles = {
    avatar: {
      "background-color": "rgb(0, 188, 212)",
      "margin-right": "15px"
    },
    dialog: {
      width: "450px",
      height: "300px"
    },
    dialogWithImage: {
        width: "720px",
        height: "520px"
    },
    fieldContainer: {
      "overflow-y": "hidden",
      padding: "16px 45px"
    },
    postHeader: {
      display: "flex",
      "justify-content": "space-between",
    },
    subHeader: {
      display: "flex",
      "align-items": "center"
    },
    action: {
        "margin-top": "15px"
    },
    iconButton: {
        padding: "10px",
        right: "14px"
    },
    icon: {
        "font-size": "1.8rem"
    },
    image: {
        "max-width": "100%",
        "object-fit": "contain"  
    },
    inputFile: {
        "display": "none"
    }
}

class PostEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
            text: this.props.defaultValue,
            image: undefined,
            imageUrl: this.props.imageUrl
        }
    }
    handleChange = (e) => {
        this.setState({text: e.target.value})
    }
    handleImageUpload = (e) => {
        this.setState({image: e.target.files[0]})
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0])
        reader.addEventListener(
            "load", 
            function () {
                this.setState({imageUrl: reader.result})
            }.bind(this), 
            false
        );
    }
    // If user remove the image, but then decide not to edit post and close dialog, we should keep the image in editor.
    componentDidUpdate(prevProps) {
        if (this.props.open === true && prevProps.open === false && !this.state.imageUrl) {
            this.setState({imageUrl: this.props.imageUrl})
        }
    }
    resetImages = () => {
        this.setState({
            image: undefined,
            imageUrl: undefined
        })
    }
	render() {
        const { 
            classes, 
            open, 
            loading, 
            closeDialog, 
            handleUpdate, 
            mode, 
            defaultValue, 
            user 
        } = this.props;
        const { imageUrl } = this.state
        return (
        <Dialog 
            open = {open} 
            onClose = {
                (loading) 
                ? null
                : closeDialog 
            }
            maxWidth = "md"
        >
            <div className = {!imageUrl ? classes.dialog : classes.dialogWithImage}>
                <DialogTitle id="form-dialog-title">
                    <div className = {classes.postHeader}>
                        <div className = {classes.subHeader}>
                            <ProfileImage
                                user = {user}
                                style = {classes.avatar}
                            />
                            <span>
                            {user.username}
                            </span>
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent className = {classes.fieldContainer}>
                    <TextField
                        autoFocus
                        margin="dense"
                        placeholder = "What are you thinking"
                        multiline
                        rows = {3}
                        rowsMax = {4}
                        onChange = {this.handleChange}
                        defaultValue = {defaultValue}
                        fullWidth
                    />
                    <br/>
                    <Tooltip title="Upload image">
                        <IconButton
                            className = {classes.iconButton}
                            onClick = {() => this.refs['file-upload'].click()} 
                        >
                            <Photo className = {classes.icon}/>
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant = "contained"
                        disabled = {!this.state.imageUrl}
                        onClick = {this.resetImages}
                    >
                        Remove Photo
                    </Button>
                    <input
                        type = "file" 
                        className = {classes.inputFile} 
                        ref = {'file-upload'}
                        onChange = {this.handleImageUpload} 
                    />
                    {imageUrl
                        ? (
                            <img id="" src={this.state.imageUrl} alt = "preview" className = {classes.image} />
                        )
                        : (
                            ""
                        )
                    }
                </DialogContent>
                <DialogActions className = {classes.action}>
                    <Button 
                        onClick={() => {
                            handleUpdate(
                                this.state.text,
                                this.state.image,
                                this.state.imageUrl
                            ).then(() => this.resetImages())
                        }} 
                        color="primary" 
                        disabled = {loading}
                    >
                    {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            mode
                        )}
                    </Button>
                    <Button onClick={closeDialog} color="primary" disabled = {loading}>
                    Cancel
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
		);
	}
}

const mapStateToProps = (state) => ({
    user: state.user
})
export default connect(
    mapStateToProps,
    null
)(withStyles(styles)(PostEditor))