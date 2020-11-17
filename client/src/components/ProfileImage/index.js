import React, { Component } from 'react'
import { Avatar } from '@material-ui/core'

export default class ProfileImage extends Component {
    render() {
        const {style, user} = this.props
        return (
            user.imageUrl 
            ? (
                <Avatar src = {user.imageUrl} className = {style}/>
            )
            : (
                <Avatar className = {style}>
                    {user.username[0].toUpperCase()}
                </Avatar>
            )
        )
    }
}
