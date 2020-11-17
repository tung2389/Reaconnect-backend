import React from 'react'
import {
    Button,
    Typography,
    TextField
} from '@material-ui/core';

import Layout from '../../layout/layout'
import LoadingCircle from '../../components/LoadingCircle'
import ProfileImage from '../../components/ProfileImage'
import { withStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'
import { uploadProfileImage, editUserProfile, changePassword } from '../../redux/actions/userActions'

const styles = {
	avatar: {
		"background-color": "rgb(0, 188, 212)",
		width: "300px",
		height: "300px",
        "font-size": "8rem",
	},
	name: {
		"margin-left": "30px",
		color: "white",
		"font-size": "40px",
		"border-bottom": "6px solid #eae9e9"
	},
	button: {
		"margin-top": "30px",
		height: "60px",
	},
	container: {
        "display": "flex",
        "justify-content": "space-evenly",
        "flex-direction": "row",
    },
    component: {
        "display": "flex",
        "flex-direction": "column",
    },
    input: {
        display: "none"
    },
    textField: {
        "width": "300px",
        "margin-top": "15px"
    },
    username: {
        "margin-top": "20px",
        "display": "flex",
        "justify-content": "center"
    }
}

class Setting extends React.Component{
	constructor(props) {
        super(props)
        this.state = {
            uploadImageLoading: false,
            editProfileLoading: false,
            changePasswordLoading: false,
            username: '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            errors: {},
            errorsProfile: {}
        }
    }
    handleFieldChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }
    handleImageUpload = (event) =>  {
        this.setState({uploadImageLoading: true})
        const image = event.target.files[0]
        const formData = new FormData()
        formData.append('image', image, image.name)
        this.props.uploadProfileImage(formData)
                    .then(() => {
                        this.setState({uploadImageLoading: false})
                    })
                    .catch(() => {
                        this.setState({uploadImageLoading: false})
                    })
    }
    handleEditProfile = () => {
        this.setState({editProfileLoading: true})
        const userData = {
            username: this.state.username
        }
        this.props
            .editUserProfile(userData)
            .then(() => {
                this.setState({
                    editProfileLoading: false,
                    errorsProfile: {}
                })
            })
            .catch((err) => {
                this.setState({
                    editProfileLoading: false,
                    errorsProfile: err.response.data
                })
            })
    }
    handleChangePassword = () => {
        this.setState({changePasswordLoading: true})
        const passwordData = {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            confirmPassword: this.state.confirmPassword
        }
        this.props
            .changePassword(passwordData)
            .then(() => {
                this.setState({
                    changePasswordLoading: false,
                    errors: {}
                })
            })
            .catch((err) => {
                this.setState({
                    errors: err.response.data,
                    changePasswordLoading: false
                })
            })
    }
	render() {
        const { classes, user } = this.props;
        const { 
            uploadImageLoading, 
            editProfileLoading, 
            changePasswordLoading, 
            errors, 
            errorsProfile 
        } = this.state
        
        return (
            <Layout siteTitle = "Setting">
                <div className = {classes.container}>
                    <div className = {classes.component}>
                    <TextField 
                        onChange = {this.handleFieldChange} 
                        label = "Change username" 
                        name = "username"
                        helperText = {errorsProfile.username}
                        error = {errorsProfile.username ? true : false}
                        className = {classes.textField}
                        disabled = {editProfileLoading}
                    />
                    <Button 
                        onClick = {this.handleEditProfile}
                        variant="contained"
                        className = {classes.button}
                        disabled = {editProfileLoading}
                    >
                        Update username
                    </Button>
                    </div>
                    <div className = {classes.component}>
                    <ProfileImage
                        user = {user}
                        style = {classes.avatar}
                    />
                    <Typography variant = "h4" className = {classes.username}>
                        {user.username}
                    </Typography>
                    <input
                        type = "file" 
                        className = {classes.input} 
                        ref = {'file-upload'}
                        onChange = {this.handleImageUpload} 
                    />
                    <Button
                        variant="contained"
                        className = {classes.button}
                        onClick={e => {
                            this.refs['file-upload'].click()
                        }}
                        disabled = {uploadImageLoading}
                    >
                        {!uploadImageLoading
                            ? (
                                "Change profile image"
                            )
                            : (
                                "Loading..."
                            )
                        }
                    </Button>
                    </div>
                    <div className = {classes.component}>
                    <TextField 
                        type = "password"
                        onChange = {this.handleFieldChange} 
                        label = "Old password" 
                        name = "oldPassword"
                        helperText = {errors.oldPassword}
                        error = {errors.oldPassword ? true : false}
                        className = {classes.textField}
                        disabled = {changePasswordLoading}
                    />
                    <TextField 
                        type = "password"
                        onChange = {this.handleFieldChange} 
                        label = "New password" 
                        name = "newPassword"
                        helperText = {errors.newPassword}
                        error = {errors.newPassword ? true : false}
                        className = {classes.textField}
                        disabled = {changePasswordLoading}
                    />
                    <TextField 
                        type = "password"
                        onChange = {this.handleFieldChange} 
                        label = "Confirm new password" 
                        name = "confirmPassword"
                        helperText = {errors.confirmPassword}
                        error = {errors.confirmPassword ? true : false}
                        className = {classes.textField}
                        disabled = {changePasswordLoading}
                    />
                    <Button 
                        onClick = {this.handleChangePassword}
                        variant="contained"
                        className = {classes.button}
                        disabled = {changePasswordLoading}
                    >
                        Change password
                    </Button>
                    </div>
                </div>
            </Layout>
        );
	}
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    uploadProfileImage,
    editUserProfile,
    changePassword
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(withStyles(styles)(Setting));