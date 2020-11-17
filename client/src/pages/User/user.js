import React from 'react'
import {
    Typography,
    CircularProgress
} from '@material-ui/core';

import Layout from '../../layout/layout'
import Post from '../../components/Post'
import LoadingCircle from '../../components/LoadingCircle'
import ProfileImage from '../../components/ProfileImage'
import { withStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'
import { getPosts } from '../../redux/actions/postActions'
import axios from 'axios';

const styles = {
	avatar: {
		"background-color": "rgb(0, 188, 212)",
		width: "300px",
		height: "300px",
        "font-size": "8rem",
	},
	container: {
        "display": "flex",
        "align-items": "center",
        "flex-direction": "column",
    },
    component: {
        "display": "flex",
        "flex-direction": "column",
    },
    username: {
        "margin-top": "20px",
        "display": "flex",
        "justify-content": "center"
    }
}

const LIMIT = 10

class User extends React.Component{
	constructor(props) {
        super(props)
        this.state = {
            user: undefined,
            loading: true,
            newPostLoading: false,
            gotAllPosts: false
        }
    }
    handleGetNewPosts = () => {
        const { id } = this.props.match.params
        this.setState({newPostLoading: true})
        const posts = this.props.posts
        const dateOfLastPost = posts[posts.length - 1].createdAt
        this.props
            .getPosts(dateOfLastPost, LIMIT, id , 'ADD')
            .then(numNewPosts => {
                this.setState({newPostLoading: false})
                if(numNewPosts < LIMIT) {
                    this.setState({gotAllPosts: true})
                }
            })
    }
    componentDidMount() {
        const { id } = this.props.match.params
        Promise
            .all([
                this.props.getPosts(new Date(), LIMIT, id, 'SET'),
                axios.get(`/api/user/${id}`)
            ])
            .then((res) => {
                this.setState({user: res[1].data})
                this.setState({loading: false})
            })
            .catch(() => {
                this.setState({loading: false})
            })

        window.addEventListener('scroll', function() {
            if(!this.state.gotAllPosts && !this.state.newPostLoading) {
                let rootDiv = document.getElementById('root')
                if ((window.innerHeight + Math.ceil(window.scrollY)) >= rootDiv.offsetHeight) {
                    this.handleGetNewPosts()
                }
            }
        }.bind(this));
    }
	render() {
        const { classes, posts } = this.props;
        const { loading, user, newPostLoading } = this.state

        if(!loading) {
            return (
                <Layout siteTitle = "Setting">
                    <div className = {classes.container}>
                        <div className = {classes.component}>
                            <ProfileImage
                                user = {user}
                                style = {classes.avatar}
                            />
                            <Typography variant = "h4" className = {classes.username}>
                                {user.username}
                            </Typography>
                        </div>
                        {posts.map((post) => 
                            <Post key = {post._id} post = {post} />
                        )}
                        {
                            newPostLoading ? (
                                <CircularProgress size = {100} />
                            ) : (
                                ""
                            )
                        }
                    </div>
                </Layout>
            );
        }
        else {
            return (
                <LoadingCircle/>
            )
        }
	}
}

const mapStateToProps = (state) => ({
    posts: state.data.posts
})

const mapActionsToProps = {
    getPosts
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(withStyles(styles)(User));