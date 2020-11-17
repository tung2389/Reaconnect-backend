import React from 'react'
import Layout from '../../layout/layout'
import LoadingCircle from '../../components/LoadingCircle'
import Post from '../../components/Post'
import { withStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'
import { getPost } from '../../redux/actions/postActions'

const styles = {
    container: {
        display: "flex",
        "flex-direction": "column",
        "align-items": "center"
    }
}

class PostPage extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
        }
    }
    componentDidMount() {
        const { id } = this.props.match.params
        this.props
            .getPost(id)
            .then(() => {
                this.setState({loading: false})
            })
            .catch(() => {
                this.setState({loading: false})
            })
    }
    render() {
        const { loading } = this.state
        const { post, classes } = this.props
        if(!loading) {
            return (
                <Layout siteTitle = {post.author}>
                    <div className = {classes.container}>
                        <Post key = {post._id} post = {post} />
                    </div>
                </Layout>
            )
        }
        else{
            return(
                <LoadingCircle/>
            )
        }
    }
}

const mapStateToProps = (state, ownProps) => ({
    post: state.data.posts.find(item => item._id === ownProps.match.params.id),
    posts: state.data.posts
})

const mapActionsToProps = {
    getPost
}

export default connect(
    mapStateToProps,
    mapActionsToProps,
)(withStyles(styles)(PostPage))