import React, { Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'
import Auth from '../../lib/Auth'


class Menu extends React.Component {
  constructor() {
    super()

    this.state = { }
    this.logout = this.logout.bind(this)
  }

  componentDidMount() {
    this.getUserId()
    this.setLocationInState()
  }

  getUserId() {
    this.setState({ userId: Auth.getPayload().sub })
  }

  componentDidUpdate() {
    if (this.state.previousLocation !== this.props.history.location) {
      this.getUserId()
      this.setLocationInState()
    }
  }

  setLocationInState() {
    this.setState({ previousLocation: this.props.history.location })
  }

  logout() {
    //Auth.logout()
    this.props.history.push('/')
  }

  toggleNavbar() {
    this.setState({ navbarOpen: !this.state.navbarOpen })
  }

  render() {

    return (
      <Fragment>



        <header className="navbar is-base p-fixed">
          <article className="navbar-section">
            <a href="#" className="btn btn-link">Help</a>
          </article>
          <article className="navbar-center">
            <Link to='/' className="nav-link">picobank</Link>
          </article>
          <article className="navbar-section">

            {//!Auth.isAuthenticated() &&
              <Link to='/register' className="button">Sign up</Link>
            }
            {//!Auth.isAuthenticated() &&
              <Link to='/login' className="nav-link">Login</Link>
            }
            {//Auth.isAuthenticated() &&
              <Link to='/banking' className="nav-link">Accounts</Link>
            }
            {//Auth.isAuthenticated() &&
              <a href="#" onClick={this.logout} className="nav-link">Log Out</a>
            }

          </article>
        </header>











      </Fragment>
    )
  }
}

export default withRouter(Menu)
