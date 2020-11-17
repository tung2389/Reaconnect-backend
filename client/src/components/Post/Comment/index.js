import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Options from '../../Options'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import CommentEditor from './Editor'
import ProfileImage from '../../ProfileImage'

import { connect } from 'react-redux'
import { editComment, deleteComment } from '../../../redux/actions/commentActions'


const styles = {
  avatar: {
    "background-color": "rgb(0, 188, 212)",
	  width: "30px",
	  height: "30px",
	  "font-size": "0.95rem"
  },
  moreVertIcon: {
	  "font-size": "1.25rem"
  },
  commentPadding: {
	  padding: "4px 10px 4px 10px"
  },
  deleteCommentLoading: {
    opacity: 0.5
  } 
};

class Comment extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            deleteCommentLoading: false,
            editMode: false
        }
    }
	render() {
        const { classes, postId, comment, user } = this.props;
        const { author, authorId, authorImageUrl, content, createdAt, _id } = comment
        const commentOptions = [
            {
                text: 'Edit',
                action: () => this.setState({editMode: true})
            },
            {
                text: 'Delete',
                action: () => {
                this.setState({deleteCommentLoading: true})
                this.props.deleteComment(postId, _id)
                    .then(() => {
                        // No need to do this because the comment is not rendered anymore
                        //this.setState({deleteCommentLoading: false})
                    })
                    .catch(() => {
                        this.setState({deleteCommentLoading: false})
                    })
                }
            }
        ]
        return (
            (!this.state.editMode)
            ? (
            <Card 
                key = {_id} 
                className = {
                    !this.state.deleteCommentLoading 
                    ? ""
                    : classes.deleteCommentLoading
                }
            >
                <CardHeader
                    avatar={
                        <ProfileImage
                            style = {classes.avatar}
                            user = {{
                                username: author,
                                imageUrl: authorImageUrl
                            }}
                        />
                    }
                    title = {author}
                    subheader= {dayjs(createdAt).fromNow()}
                    action = {
                        (authorId === user._id && !this.state.deleteCommentLoading) 
                        ? (
                            <Options optionsList = {commentOptions} displayComponent = {
                                <MoreVertIcon className = {classes.moreVertIcon}/>
                            }
                            />
                        ) 
                        : (
                            ""
                        )		  
                    }
                    className = {classes.commentPadding}
                />
                <CardContent className = {classes.commentPadding}>
                <Typography variant="body2" component="p">
                    {content}
                </Typography>
                </CardContent>
            </Card>	
            )
            : (
            <CommentEditor 
                postId = {postId}
                comment = {comment}
                closeEditor = {() => this.setState({editMode: false})}
            />
            )
        )
	}
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
  editComment,
  deleteComment
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Comment));