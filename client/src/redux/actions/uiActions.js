import {
    TOGGLE_SIDE_NAV
} from '../types'

export const toggleSideNav = () => (dispatch) => {
    dispatch({type: TOGGLE_SIDE_NAV});
}