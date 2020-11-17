import React from 'react'
import { TextField, Avatar, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { createComment } from '../../../../redux/actions/commentActions'
import { connect } from 'react-redux'

import ProfileImage from '../../../ProfileImage'

const styles = {
	header: {
		"border-top": "1px solid #cccccc",
		display: "flex",
		"align-items": "center",
		"padding":"8px 8px 8px 8px"
	},
	commentField: {
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
		"padding": "8px 8px 8px 8px"
	}
}

class CommentCreator extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			content: "",
			createCommentLoading: false
		}

	}
	handleChange = (e) => {
		this.setState({content: e.target.value})
	}
	render() {
		const { classes, author, authorImageUrl, postId } = this.props;
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
						className = {classes.commentField}
						margin="dense"
						placeholder = "Leave a comment"
						multiline
						rows = {2}
						rowsMax = {4}
						onChange = {this.handleChange}
						disabled = {this.state.createCommentLoading}
					/>
				</div>
				<div className = {classes.actions}>
					<Button
						color = "primary"
						onClick = {
							() => {
								this.setState({createCommentLoading: true})
								this.props.createComment(
									postId, 
									{content: this.state.content}
								).then(() => {
									this.setState({createCommentLoading: false})
								})
								.catch(() => {
									this.setState({createCommentLoading: false})
								})
							}
						}
						disabled = {this.state.createCommentLoading}
					>
						Post
					</Button>
				</div>
			</div>
		)
	}
}

const mapActionsToProps = {
	createComment
}

export default connect(
	null,
	mapActionsToProps
)(withStyles(styles)(CommentCreator))