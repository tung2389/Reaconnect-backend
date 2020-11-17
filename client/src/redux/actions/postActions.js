import {
    UPLOAD_POST,
    SET_POSTS,
    EDIT_POST,
    DELETE_POST,
    ADD_POSTS
} from '../types'
import axios from 'axios'

export const getPosts = (lastDate, limit, authorId, mode) => (dispatch) => {
    return axios.get('/api/posts', {
        params: {
            lastDate: lastDate,
            limit: limit,
            authorId: authorId
        }
    })
        .then(res => {
            if(mode === 'SET') {
                dispatch({
                    type: SET_POSTS,
                    payload: res.data
                })
            }
            else if(mode === 'ADD') {
                dispatch({
                    type: ADD_POSTS,
                    payload: res.data
                })
                return res.data.length
            }
        })
}

// Get only one post with specific id and assign the state.data.posts array to the array holding only this post
export const getPost = (postId) => (dispatch, getState) => {
    return axios
        .get(`/api/posts/${postId}`)
        .then((res) => {
            dispatch({
                type: SET_POSTS, // Remember, state.data.posts are all posts that user NEED to see 
                payload: [res.data]
            })
        })
}

export const uploadPost = (post) => (dispatch) => {
    return axios.post('/api/posts', post)
        .then(res => {
            dispatch({
                type: UPLOAD_POST,
                payload: res.data.post
            })
            return res.data.message
        })
}

export const editPost = (postId, newPost) => (dispatch, getState) => {
    return axios
        .put(`/api/posts/${postId}`, newPost)
        .then(res => {
            let posts = getState().data.posts;
            dispatch({
                type: EDIT_POST,
                payload: posts.map((item) => {
                    if(item._id === postId) {
                        return res.data
                    }
                    return item
                })
            })
        })
} 
export const deletePost = (postId) => (dispatch, getState) => {
    return axios
        .delete(`/api/posts/${postId}`)
        .then(() => {
            let posts = getState().data.posts;
            dispatch({
                type: DELETE_POST,
                payload: posts.filter(post => post._id !== postId)
            })
        })
}