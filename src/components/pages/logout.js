import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { withRouter } from "react-router-dom"


const Logout = props => {

  const { history } = props

  useEffect(() => {
    window.localStorage.clear()
    window.alert("로그아웃 되었습니다.")
    history.push("/")
  }, [])

  return <></>
}

Logout.propTypes = {
  history: PropTypes.object,
}

export default withRouter(Logout)
