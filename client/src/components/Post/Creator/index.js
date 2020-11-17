import React from 'react';
import { withStyles } from '@material-ui/core/styles'
import {
  Typography,
  ButtonBase,
} from '@material-ui/core';

import SnackBar from './snackBar'
import PostEditor from '../Editor'
import ProfileImage from '../../ProfileImage'

import { connect } from 'react-redux'
import { uploadPost } from '../../../redux/actions/postActions'

const styles = {
    container: {
      width: "600px",
      "background-color": "white",
      "box-shadow": "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      transition: "0.3s",
      "padding": "20px 0px 20px 20px",
      "justify-content": "flex-start",
      '&:hover': {
        "background-color": "#d9d9d9"
      }
    },
    avatar: {
      "background-color": "rgb(0, 188, 212)",
      "margin-right": "15px"
    },
    placeHolder: {
      opacity: 0.4
    },
}

class PostCreator extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            snackBarOpen: false,
            loading: false,
            errors: '',
            message: ''
        }
    }

    openDialog = () => {
        this.setState({open: true})
    }
    closeDialog = () => {
        this.setState({open: false})
    }

    closeSnackBar = () => {
        this.setState({snackBarOpen: false})
    }
    handleCreate = (text, image, imageUrl) => {
      this.setState({loading: true})
      const newPost = new FormData()
      newPost.append('text', text)
      if(image) {
        newPost.append('image', image, image.name)
      }
      
      return this.props.uploadPost(newPost)
        .then(message => {
          this.setState({
            message: message,
            loading: false,
            snackBarOpen: true
          })
          this.closeDialog()
        })
        .catch(err => {
          this.setState({
            errors: err.response.data,
            loading: false,
            snackBarOpen: true
          })
          this.closeDialog()
        })
    }
    render() {
        const { classes, user } = this.props;
        const { loading, errors, message, snackBarOpen } = this.state
        return(
            <div>
            <ButtonBase className = {classes.container} onClick = {this.openDialog}>
              <ProfileImage
                user = {user}
                style = {classes.avatar}
              />
              <Typography className = {classes.placeHolder}>What are you thinking</Typography>
            </ButtonBase>
            <PostEditor 
              loading = {loading} 
              open = {this.state.open}
              closeDialog = {this.closeDialog}
              handleUpdate = {this.handleCreate}
              defaultValue = ""
              mode = "Post"
            />
            <SnackBar
              errors = {errors} 
              message = {message} 
              open = {snackBarOpen}
              handleClose = {this.closeSnackBar}
             />
          </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
  uploadPost
}

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(withStyles(styles)(PostCreator))
