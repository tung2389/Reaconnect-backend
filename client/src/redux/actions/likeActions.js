import {
    LIKE_POST,
    UNLIKE_POST
} from '../types'
import axios from 'axios'

export const likePost = (postId, setLikeLoading) => (dispatch, getState) => {
    let posts = getState().data.posts;
    dispatch({
        type: LIKE_POST,
        payload: posts.map((item) => {
            if(item._id === postId) {
                return {
                    ...item,
                    likedByUser: true,
                    likeCount: item.likeCount + 1
                }
            }
            else {
                return item
            }
        })
    })
    setLikeLoading()
    return axios.post(`/api/posts/${postId}/likes`)
}

export const unlikePost = (postId, setLikeLoading) => (dispatch, getState) => {
    let posts = getState().data.posts;
    dispatch({
        type: UNLIKE_POST,
        payload: posts.map((item) => {
            if(item._id === postId) {
                return {
                    ...item,
                    likedByUser: false,
                    likeCount: item.likeCount - 1
                }
            }
            else {
                return item
            }
        })
    })
    setLikeLoading()
    return axios.delete(`/api/posts/${postId}/likes`)
}