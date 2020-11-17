import {
    TOGGLE_SIDE_NAV
} from '../types'

const intialState = {
    sideNavOpen: false,
}

export default function(state = intialState, action) {
    switch(action.type) {
        case TOGGLE_SIDE_NAV: 
            return {
                ...state,
                sideNavOpen: !state.sideNavOpen
            }
        default: 
            return state
    }
}