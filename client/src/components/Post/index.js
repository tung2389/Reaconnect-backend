import React from 'react';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs'
import copy from 'copy-to-clipboard'
import relativeTime from 'dayjs/plugin/relativeTime';
import {
    Typography,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    IconButton,
    CardMedia
} from '@material-ui/core';

import {
    Favorite as FavoriteIcon,
    Comment as CommentIcon,
    Share,
    MoreVert as MoreVertIcon
} from '@material-ui/icons';

import Options from '../Options' 
import PostEditor from './Editor'
import ConfirmDelete from './ConfirmDelete' 
import Comment from './Comment'
import CommentCreator from './Comment/Creator'
import ShareDialog from './ShareDialog'
import ProfileImage from '../ProfileImage'

import { connect } from 'react-redux'
import { likePost, unlikePost } from '../../redux/actions/likeActions'
import { editPost, deletePost } from '../../redux/actions/postActions'
import { getComments } from '../../redux/actions/commentActions'

const styles = {
  card: {
    width: "600px",
    "margin-top": "25px",
    "margin-bottom": "25px"
  },
  avatar: {
      "background-color": "rgb(0, 188, 212)",
  },
  action: {
      display: "flex",
      "justify-content": "space-around",
  },
  content: {
      padding: "0px"
  },
  text: {
    padding: "10px 16px 6px 16px"
  },
  liked: {
      "color": "rgb(0, 188, 212)"
  },
  number: {
    position: "relative",
	right: "6px"
  },
  image: { 
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  comments: {
    "border-top": "1px solid #cccccc",
    "max-height": "500px",
    "overflow-y": "auto",
    "overflow-x": "hidden"
  },
  loading: {
    "position": "relative",
    "left": "50%",
    "top": "50%",
    "transform": "translate(-50%, 0%)"
  }
};

class Post extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            getCommentLoading: false,
            openPostEditor: false,
            openConfirmDelete: false,
            openShareDialog: false,
            editPostLoading: false,
            deletePostLoading: false,
            likeLoading: false,
        }
    }
    handleComments = (postId) => {
        this.setState({getCommentLoading: true})
        this.props.getComments(postId)
            .then(() => this.setState({getCommentLoading: false}))
            .catch(() => this.setState({getCommentLoading: false}))
    }

    openPostEditor = () => {
        this.setState({openPostEditor: true})
    }
    closePostEditor = () => {
        this.setState({openPostEditor: false})
    }

    openConfirmDelete = () => {
        this.setState({openConfirmDelete: true})
    }
    closeConfirmDelete = () => {
        this.setState({openConfirmDelete: false})
    }

    openShareDialog = () => {
        this.setState({openShareDialog: true})
    }
    closeShareDialog = () => {
        this.setState({openShareDialog: false})
    }

    handleEdit = (text, image, imageUrl) => {
        this.setState({editPostLoading: true})
        const newPost = new FormData()
        newPost.append('text', text)
        if(image) {
          newPost.append('image', image, image.name)
        }
        if(!imageUrl && imageUrl !== this.props.post.imageUrl) {
            newPost.append('imageStatus', 'removed')
        }
        else if(imageUrl !== this.props.post.imageUrl) {
            newPost.append('imageStatus', 'changed')
        }
        else {
            newPost.append('imageStatus', 'unchanged')
        }
        return this.props.editPost(this.props.post._id, newPost)
            .then(() => {
                this.setState({editPostLoading: false})
                this.closePostEditor()
            })
            .catch(() => {
                this.setState({editPostLoading: false})
                this.closePostEditor()
            }) 
    }

    handleDelete = () => {
        this.setState({deletePostLoading: true})
        this.props.deletePost(this.props.post._id)
            .then(() => {
                this.setState({deletePostLoading: false})
                this.closeConfirmDelete()
            })
            .catch(() => {
                this.setState({deletePostLoading: false})
                this.closeConfirmDelete()
            }) 
    }

    render() {
        const { classes, post, likePost, unlikePost, user } = this.props;
        const { likedByUser, comments, commentCount } = post
        let postOptions
        if(post.authorId === user._id) {
            postOptions = [
                {
                    text: "Edit post",
                    action: this.openPostEditor
                },
                {
                    text: "Delete post",
                    action: this.openConfirmDelete
                },
                {
                    text: "View post",
                    action: () => {
                        this.props.history.push(`/posts/${post._id}`)
                    }
                },
                {
                    text: "View user profile",
                    action: () => {
                        this.props.history.push(`/users/${post.authorId}`)
                    }
                }
            ]
        }
        else {
            postOptions = [
                {
                    text: "View post",
                    action: () => {
                        this.props.history.push(`/posts/${post._id}`)
                    }
                },
                {
                    text: "View user profile",
                    action: () => {
                        this.props.history.push(`/users/${post.authorId}`)
                    }
                }
            ]
        }
        dayjs.extend(relativeTime);
        return(
            <Card elevation = {4} key = {post._id} className={classes.card}>
                <CardHeader
                    avatar={
                        <ProfileImage
                            style = {classes.avatar}
                            user = {{
                                username: post.author,
                                imageUrl: post.authorImageUrl
                            }}
                        />
                    }
                    title = {post.author}
                    subheader= {dayjs(post.createdAt).fromNow()}
					action = {
						<Options optionsList = {postOptions} displayComponent = {<MoreVertIcon/>}/>
					}
                />
                <CardContent className = {classes.content}>
                    <Typography variant="body2" component="p" className = {classes.text}>
                        {post.content}
                    </Typography>
                    { post.imageUrl
                    ? (
                            <CardMedia
                            className = {classes.image}
                            image = {post.imageUrl}
                        />
                    )
                    : (
                        ""
                    )
                    }
                </CardContent>
                <CardActions className = {classes.action}>
                    <div>
                        <IconButton
                            title = "Like" 
                            onClick = {
                                (likedByUser) 
                                ? () => {
                                    unlikePost(post._id, () => this.setState({likeLoading: true}))
                                        .then((res) => {
                                            this.setState({likeLoading: false})
                                        })
                                        .catch((err) => {
                                            this.setState({likeLoading: false})
                                        })
                                }
                                : () => {
                                    likePost(post._id, () => this.setState({likeLoading: true}))
                                        .then((res) => {
                                            this.setState({likeLoading: false})
                                        })
                                        .catch((err) => {
                                            this.setState({likeLoading: false})
                                        })
                                }
                            }
                            disabled = {this.state.likeLoading}
                        >
                            <FavoriteIcon className = {(likedByUser) ? classes.liked : ""}/>
                        </IconButton>
                        <Typography variant = "caption" className = {classes.number}>
                            {post.likeCount}
                        </Typography>
                    </div>
                    <div>
                        <IconButton title = "Comment" onClick = {
                            () => this.handleComments(post._id)
                        }>
                            <CommentIcon/>
                        </IconButton>
                        <Typography variant = "caption" className = {classes.number}>
                            {commentCount}
                        </Typography>
                    </div>
                    <IconButton
                        title = "Share"
                        onClick = {() => {
                            copy(window.location.origin + `/posts/${post._id}`, {
                                message: "Post link has been copied"
                            })
                            this.openShareDialog()
                        }}
                    >
                        <Share/>
                    </IconButton>
                </CardActions>
                    {comments ? (
                        <div>
                            <div className = {classes.comments}>
                                {comments.map((comment) => 
                                        <Comment key = {comment._id} comment = {comment} postId = {post._id}/>
                                )}
                            </div>
                            <CommentCreator 
                                author = {post.author}
                                authorImageUrl = {post.authorImageUrl}
                                postId = {post._id}
                            />
                        </div>
                        ) : (
                            this.state.getCommentLoading ? (
                                    <CircularProgress size = {34} className = {classes.loading}/>
                                ) : (
                                    ""
                                )
                        )
                    }
            <PostEditor 
                loading = {this.state.editPostLoading} 
                open = {this.state.openPostEditor}
                closeDialog = {this.closePostEditor}
                handleUpdate = {this.handleEdit}
                mode = "Update"
                defaultValue = {post.content}
                imageUrl = {post.imageUrl}
            />
            <ConfirmDelete
                loading = {this.state.deletePostLoading}
                open = {this.state.openConfirmDelete}
                closeDialog = {this.closeConfirmDelete}
                handleDelete = {this.handleDelete}
            />
            <ShareDialog
                open = {this.state.openShareDialog}
                closeDialog = {this.closeShareDialog}
                defaultValue = {window.location.origin + `/posts/${post._id}`}
            />
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    likePost,
    unlikePost,
	getComments,
    editPost,
    deletePost
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(withStyles(styles)(withRouter(Post)))