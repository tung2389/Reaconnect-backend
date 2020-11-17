import React from 'react';
import { Menu, MenuItem, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert'

class PostOptions extends React.Component {
   constructor() {
     super()
     this.state = {
       anchorEl: null
     }
   }
   openMenu = (e) => {
     this.setState({anchorEl: e.currentTarget})
   }
   closeMenu = (e) => {
     this.setState({anchorEl: null})
   }
    render() {
        return (
            <div>
              <IconButton onClick={this.openMenu}>
                <MoreVertIcon/>
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={this.closeMenu}
              >
                  <MenuItem>Disable comments</MenuItem>
                  <MenuItem>Disable sharing</MenuItem>
              </Menu>
            </div>
        );
    }
}

export default PostOptions;