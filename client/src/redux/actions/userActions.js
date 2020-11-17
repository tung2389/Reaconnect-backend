import {
    SET_AUTHENTICATED,
    SET_USER_DATA,
    SET_UNAUTHENTICATED,
    LOADING_USER,
} from '../types'
import axios from 'axios';

export const login = (userData, history) => (dispatch) => {
    return axios.post('/api/login', userData) 
         .then((res) => {
             saveAuthorizationHeader(res.data.jwtToken)
             dispatch({
                type: SET_USER_DATA,
                payload: res.data.user
             })
             dispatch({type: SET_AUTHENTICATED})
             history.push('/')
         })
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('JWTToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({type: SET_UNAUTHENTICATED})
}

export const getUserData = () => (dispatch) => {
    dispatch({type: LOADING_USER})
    return axios
        .get('/api/user')
        .then((res) => {
            dispatch({
                type: SET_USER_DATA,
                payload: res.data
            })
        })
}

export const editUserProfile = (userData) => (dispatch) => {
    return axios
        .put('/api/user', userData)
        .then((res) => {
            dispatch({
                type: SET_USER_DATA,
                payload: res.data
            })
        })
}

export const changePassword = (passwordData) => (dispatch) => {
    return axios
        .put('/api/user/password', passwordData)
        .then((res) => {
            saveAuthorizationHeader(res.data.jwtToken)
        })
}

export const uploadProfileImage = (formData) => (dispatch) => {
    return axios
            .post('/api/user/image', formData)
            .then((res) => {
                dispatch({
                    type: SET_USER_DATA,
                    payload: res.data
                })
            })
}

const saveAuthorizationHeader = (token) => {
    const JWTToken = `Bearer ${token}`
    localStorage.setItem('JWTToken', JWTToken)
    axios.defaults.headers.common['Authorization'] = JWTToken;
}