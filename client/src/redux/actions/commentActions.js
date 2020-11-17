import {
	SET_COMMENT,
    CREATE_COMMENT,
    EDIT_COMMENT,
    DELETE_COMMENT
} from '../types'
import axios from 'axios'

 export const getComments = (postId) => (dispatch, getState) => {
    return axios
        .get(`/api/posts/${postId}/comments`)
        .then(res => {
			let posts = getState().data.posts;
			dispatch({
				type: SET_COMMENT,
				payload: posts.map((item) => {
					if(item._id === postId) {
						return {
							...item,
							comments: res.data
						}
					}
					return item
				})
			})
        })
 }

 export const createComment = (postId, comment) => (dispatch, getState) => {
	return axios
		.post(`/api/posts/${postId}/comments`,comment)
		.then(res => {
			let posts = getState().data.posts;
			dispatch({
				type: CREATE_COMMENT,
				payload: posts.map((item) => {
					if(item._id === postId) {
						return {
							...item,
							comments: [
								res.data,
								...item.comments
							],
							commentCount: item.commentCount + 1
						}
					}
					return item
				})
			})
		}) 
 }
 
 export const editComment = (postId, commentId, newComment) => (dispatch, getState) => {
 	return axios
 		.put(`/api/posts/${postId}/comments/${commentId}`, newComment)
 		.then((res) => {
			let posts = getState().data.posts
			dispatch({
				type: EDIT_COMMENT,
				payload: posts.map((item) => {
					if(item._id === postId) {
						return {
							...item,
							comments: item.comments.map((comment) => {
								if(comment._id === commentId) {
									return res.data
								}
								return comment
							}),
						}
					}
					return item
				})
			})
 		})
 }

 export const deleteComment = (postId, commentId) => (dispatch, getState) => {
	return axios
		.delete(`/api/posts/${postId}/comments/${commentId}`)
		.then(() => {
			let posts = getState().data.posts;
			dispatch({
				type: DELETE_COMMENT,
				payload: posts.map((item) => {
					if(item._id === postId) {
						return {
							...item,
							comments: item.comments.filter(comment => comment._id !== commentId),
							commentCount: item.commentCount - 1
						}
					}
					return item
				})
			})
		})
 }