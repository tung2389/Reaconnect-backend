import React from 'react';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Tooltip
} from '@material-ui/core';

import {
    Menu as MenuIcon
} from '@material-ui/icons'

import Options from '../components/Options' 
import ProfileImage from '../components/ProfileImage'

import { connect } from 'react-redux'
import { toggleSideNav } from '../redux/actions/uiActions'
import { logout } from '../redux/actions/userActions'

import list from '../config/sideNav'

const styles = (theme) => ({
  root: {
    "margin-bottom": "25px",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  avatar: {
    "background-color": "rgb(0, 188, 212)",
  },
  title: {
    "flex-direction": "row",
    "display": "flex",
    "align-items": "center"
  },
  toolBar: {
    maxHeight: 62,
    minHeight: 60,
    display: "flex",
    "justify-content": "space-between",
    "flex-direction": "row",
  },
  navBar: {
      width: "400px",
      display: "flex",
      "flex-direction": "row",
      "justify-content": "space-evenly",

  },
  navButton: {
      color: "white",
      "font-size": "2rem"
  }
});

class Header extends React.Component {
  render(){
    const { classes, toggleSideNav, siteTitle, user} = this.props;
    const userOptions = [
      {
        text: "Log out",
        action: this.props.logout
      },
    ]
    return (
        <AppBar position="static" className = {classes.root}>
            <Toolbar className = {classes.toolBar}>
                <div className = {classes.title}>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" onClick = {toggleSideNav}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">
                        {siteTitle}
                    </Typography>
                </div>
                <div className = {classes.navBar}>
                    {list(classes.navButton, user._id).map((item) => (
                        <Tooltip title = {item.name} key = {item.name}>
                            <IconButton
                                className = {classes.navButton} 
                                onClick = {() => this.props.history.push(item.link)}
                            >
                                {item.icon}
                            </IconButton>
                        </Tooltip>
                        ))
                    }
                </div>
                <Options optionsList = {userOptions} displayComponent = {
                    <ProfileImage
                        user = {user}
                        style = {classes.avatar}
                    />
                }/>
            </Toolbar>
        </AppBar>
      );
  }
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    logout,
    toggleSideNav
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(withStyles(styles)(withRouter(Header)))
