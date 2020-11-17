import React from 'react'
import {  
    Dialog, 
    DialogActions, 
    DialogTitle, 
    DialogContent,
    Button, 
    CircularProgress 
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'

const styles = {
    dialog: {
      width: "400px",
      height: "200px"
    },
    delete: {
        "background-color": "#ff3333",
        color: "white",
        '&:hover': {
            "background-color": "#e60000"
        }
    }
}

class PostEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postContent: "",
    }
  }
  handleChange = (e) => {
    this.setState({postContent: e.target.value})
  }
	render() {
	  const { classes, open, loading, closeDialog, handleDelete } = this.props;
	  return (
      <Dialog 
        open = {open} 
        onClose = {
          (loading) 
          ? null
          : closeDialog 
        }
      >
        <div className = {classes.dialog}>
          <DialogTitle id="form-dialog-title">
            <div>Delete</div>
          </DialogTitle>
          <DialogContent>
            <div>Do you want to delete this post? This process cannot be undone</div>
          </DialogContent>
          <DialogActions>
            <Button 
                onClick = {handleDelete} 
                disabled = {loading}
                className = {classes.delete}
            >
              {loading ? (
                    <CircularProgress size={24} />
                ) : (
                    "Delete"
                )}
            </Button>
            <Button onClick={closeDialog} color="primary" disabled = {loading}>
              Cancel
            </Button>
          </DialogActions>
        </div>
      </Dialog>
		);
	}
}

const mapStateToProps = (state) => ({
    user: state.user
})
export default connect(
    mapStateToProps,
    null
)(withStyles(styles)(PostEditor))