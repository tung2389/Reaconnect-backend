import React from 'react';
import { MenuList, MenuItem, IconButton, Popover, Paper } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert'

class Options extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null
    }
  }

  handleClick = (e) => {
    this.setState({anchorEl: e.currentTarget})
  }

  handleClose = () => {
    this.setState({anchorEl: null})
  }

  render() {
    const { optionsList, displayComponent } = this.props; 
    return (
        <div>
          <IconButton onClick={this.handleClick}>
            {displayComponent}
          </IconButton>
          <Popover 
            open = {Boolean(this.state.anchorEl)} 
            anchorEl = {this.state.anchorEl}
            onClose = {this.handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <Paper elevation = {2}>
              <MenuList
                id="simple-menu"
                autoFocusItem = {Boolean(this.state.anchorEl)}
              >
                  {optionsList.map((option) => (
                    <MenuItem key = {option.text} onClick = {option.action}>{option.text}</MenuItem>
                  ))}
              </MenuList>
            </Paper>
          </Popover>
        </div>
    );
  }
}

export default Options;