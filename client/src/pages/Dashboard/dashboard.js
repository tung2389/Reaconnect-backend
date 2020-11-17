import React from 'react'
import {
    CircularProgress
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Layout from '../../layout/layout'
import PostCreator from '../../components/Post/Creator'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import Post from '../../components/Post'

import { connect } from 'react-redux'
import { getPosts } from '../../redux/actions/postActions'

const LIMIT = 10

const styles = {
    container: {
        display: "flex",
        "flex-direction": "column",
        "align-items": "center"
    }
}

class Dashboard extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            newPostLoading: false,
            gotAllPosts: false
        }
    }
    handleGetNewPosts = () => {
        this.setState({newPostLoading: true})
        const posts = this.props.posts
        const dateOfLastPost = posts[posts.length - 1].createdAt
        this.props
            .getPosts(dateOfLastPost, LIMIT, undefined, 'ADD')
            .then(numNewPosts => {
                this.setState({newPostLoading: false})
                if(numNewPosts < LIMIT) {
                    this.setState({gotAllPosts: true})
                }
            })
    }
    componentDidMount() {
        this.props.getPosts(new Date(), 10, undefined, 'SET')
            .then(() => {
                this.setState({loading: false})
            })
            .catch(() => {
                this.setState({loading: false})
            })
        window.addEventListener('scroll', function() {
            if(!this.state.gotAllPosts && !this.state.newPostLoading) {
                let rootDiv = document.getElementById('root')
                if ((window.innerHeight + window.scrollY) >= rootDiv.offsetHeight) {
                    this.handleGetNewPosts()
                }
            }
        }.bind(this));
    }

    render() {
        const { posts, classes } = this.props
        const { loading, newPostLoading } = this.state
        dayjs.extend(relativeTime);
        return(
            <Layout siteTitle = 'News'>
                <div className = {classes.container}>
                    <PostCreator/>
                    {loading ? (
                        <CircularProgress size = {100}/>
                    ) : (
                        posts.map((post) => 
                            <Post key = {post._id} post = {post} />
                        )
                    )}
                    {newPostLoading ? (
                        <CircularProgress size = {100}/>
                    ) : (
                        ""
                    )
                    }
                </div>
            </Layout>
        )
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
    mapActionsToProps,
)(withStyles(styles)(Dashboard))