import {
    SET_AUTHENTICATED,
    SET_USER_DATA,
    SET_UNAUTHENTICATED,
    LOADING_USER,
} from '../types'

const initialState = {
    authenticated: false,
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LOADING_USER:
            return {
                ...state,
                loading: true
            }
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            }
        case SET_USER_DATA:
            return {
                ...action.payload,
                authenticated: true,
                loading: false,
            }
        case SET_UNAUTHENTICATED:
            return {
                ...state,
                authenticated: false
            }
        default: 
            return state
    }
}