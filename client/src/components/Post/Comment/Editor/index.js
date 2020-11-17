import React from 'react'
import {
	TextField,
	Button
} from '@material-ui/core'
import { withStyles } from '@material-ui/styles'

import { connect } from 'react-redux'
import { editComment } from '../../../../redux/actions/commentActions'

import ProfileImage from '../../../ProfileImage'

const styles = {
    header: {
		"border-top": "1px solid #cccccc",
		display: "flex",
		"align-items": "center",
		"padding":"0px 8px 0px 8px"
	},
	editField: {
		width: "500px"
    },
    avatar: {
		"background-color": "rgb(0, 188, 212)",
		width: "30px",
		height: "30px",
		"font-size": "0.95rem",
		"margin-right": "15px"
	},
	actions: {
		display: "flex",
		"justify-content": "flex-end",
		"padding": "0px 8px 0px 8px"
	}
}

class CommentEditor extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
            content: this.props.initialContent,
            editCommentLoading: false
		}
	}
	handleChange = (e) => {
		this.setState({content: e.target.value})
	}
	render() {
        const { classes, postId, comment, closeEditor } = this.props;
        const { author, authorImageUrl, content: initialContent, _id: commentId } = comment
        const { editCommentLoading } = this.state
		return (
			<div>
				<div className = {classes.header}>
                    <ProfileImage
                        style = {classes.avatar}
                        user = {{
                            username: author,
                            imageUrl: authorImageUrl
                        }}
                    />
					<TextField
						className = {classes.editField}
						margin="dense"
						defaultValue={initialContent}
						multiline
						rows = {2}
						rowsMax = {4}
                        onChange = {this.handleChange}
                        disabled = {editCommentLoading}
					/>
				</div>
				<div className = {classes.actions}>
                    <Button
						color = "primary"
						onClick = {
                            () => {
                                this.setState({editCommentLoading: true})
                                this.props.editComment(postId, commentId, {content: this.state.content})
                                    .then(() => {
                                        this.setState({editCommentLoading: false})
                                        closeEditor()
                                    })
                                    .catch(() => {
                                        this.setState({editCommentLoading: false})
                                        closeEditor()
                                    })
                            }
                        }
                        disabled = {editCommentLoading}
					>
						Update
					</Button>

                    <Button
						color = "primary"
                        onClick = {() => closeEditor()}
                        disabled = {editCommentLoading}
					>
						Cancel
					</Button>
				</div>
			</div>
		);
	}
}

const mapActionsToProps = {
	editComment
}

export default connect(
	null,
	mapActionsToProps
)(withStyles(styles)(CommentEditor))
