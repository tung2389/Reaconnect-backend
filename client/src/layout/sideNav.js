import React from 'react'
import { Link } from 'react-router-dom';
import { Drawer, ListItem, List, ListItemIcon, ListItemText } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'
import { toggleSideNav } from '../redux/actions/uiActions'

import list from '../config/sideNav'

const styles = {
    item: {
        width: "250px"
    }
}

class SideNav extends React.Component{
    render() {
        const { classes, sideNavOpen, toggleSideNav, userId } = this.props; 
        return(
            <Drawer anchor = "left" open = {sideNavOpen} onClose = {toggleSideNav}>
                <List>
                    {list("", userId).map((item) => (
                    <ListItem
                         className = {classes.item} 
                         component = {Link} 
                         to = {item.link} 
                         button 
                         key={item.name}
                         onClick = {toggleSideNav}
                     >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                    </ListItem>
                    ))}
                </List>
            </Drawer>
        )
    }
}

const mapStateToProps = (state) => ({
    userId: state.user._id,
    sideNavOpen: state.UI.sideNavOpen
})

const mapActionsToProps = {
    toggleSideNav: toggleSideNav
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(withStyles(styles)(SideNav))