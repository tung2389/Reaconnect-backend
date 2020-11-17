import {
    UPLOAD_POST,
    SET_POSTS,
    LIKE_POST,
    UNLIKE_POST,
    EDIT_POST,
    DELETE_POST,
    SET_COMMENT,
    CREATE_COMMENT,
    EDIT_COMMENT,
    DELETE_COMMENT,
    ADD_POSTS
} from '../types'

const intialState = {
    posts: [], // These are all posts that user NEED to see now
}

export default function (state = intialState, action) {
    switch (action.type) {
        case UPLOAD_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts],
            }
        case SET_POSTS:
            return {
                ...state,
                posts: action.payload,
            }
        case ADD_POSTS:
            return {
                ...state,
                posts: [...state.posts, ...action.payload],
            }
        case LIKE_POST:
        case UNLIKE_POST:
        case EDIT_POST:
        case DELETE_POST:
        case SET_COMMENT:
        case CREATE_COMMENT:
        case DELETE_COMMENT:
        case EDIT_COMMENT:
            return {
                ...state,
                posts: action.payload
            }
        default:
            return state
    }
}