import React from "react"
import PropTypes from "prop-types"

import Header from "./header"
import SideNav from "./sideNav"
import LoadingCircle from '../components/LoadingCircle'

import { connect } from 'react-redux'

const Layout = ({ children, siteTitle, userLoading, classes }) => (
      !userLoading 
      ? (
        <>
            <Header siteTitle = {siteTitle} />
            <SideNav/>
            <main>{children}</main>
        </>
      )
      : (
        <LoadingCircle/>
      )
)


Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

const mapStateToProps = (state) => ({
    userLoading: state.user.loading
})

export default connect(
    mapStateToProps,
    null
)(Layout)
