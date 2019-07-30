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
    Auth.logout()
    this.props.history.push('/')
  }

  toggleNavbar() {
    this.setState({ navbarOpen: !this.state.navbarOpen })
  }

  handleAuth(){

  }

  render() {

    return (
      <Fragment>

        <header className="navbar is-base p-fixed">

          <article className="navbar-section">
            <div className="dropdown">
              <div className="btn-group">
                <a className="btn btn-link dropdown-toggle" tabIndex="0">
                  &nbsp;Help <i className="icon icon-caret"></i>
                </a>
                <ul className="menu">
                  <li className="menu-item">
                    <Link to='/message'><i className="icon icon-mail"></i> &nbsp;Send us a secure message</Link>
                  </li>
                  <li className="divider"></li>
                  <li className="menu-item">
                    <a href="#"><i className="icon icon-search"></i> &nbsp;FAQs</a>
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <article className="navbar-center">
            <Link to='/' className="nav-link">
              <h1 className="title">p&#305;coBank</h1>
            </Link>
          </article>



          <article className="navbar-section">
            <div className="dropdown dropdown-right">
              <div className="btn-group">
                <a className="btn btn-link dropdown-toggle" tabIndex="0"><i className="icon icon-people"></i></a>

                {Auth.isAuthenticated() &&
                  <ul className="menu">
                    <li className="menu-item">
                      <Link to='/banking'><i className="icon icon-copy"></i> &nbsp;Your Accounts</Link>
                      <Link to='/link'><i className="icon icon-copy"></i> &nbsp;Link an Account</Link>
                    </li>
                    <li className="divider"></li>
                    <li className="menu-item">
                      <a onClick={this.logout}><i className="icon icon-shutdown"></i> &nbsp;Log out</a>
                    </li>
                  </ul>
                }
                {!Auth.isAuthenticated() &&
                  <ul className="menu">
                    <li className="menu-item">
                      <a href='#register-login' className="nav-link">Log in</a>
                    </li>
                    <li className="divider"></li>
                    <li className="menu-item">
                      <Link to='/register' className="button">Register for online banking</Link>
                    </li>
                  </ul>
                }
              </div>
            </div>
          </article>


        </header>

      </Fragment>
    )
  }
}

export default withRouter(Menu)
