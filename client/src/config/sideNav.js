import React from 'react'
import { Home, AccountCircle, Settings } from '@material-ui/icons'

function list(iconStyle, userId)  {
    return [
        {
            name: "Home",
            icon: <Home className = {iconStyle}/>,
            link: "/"
        },
        {
            name: "Profile",
            icon: <AccountCircle className = {iconStyle}/>,
            link: `/users/${userId}`
        },
        {
            name: "Setting",
            icon: <Settings className = {iconStyle}/>,
            link: "/setting"
        },
    ]
}

export default list