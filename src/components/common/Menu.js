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
    const payload = Auth.getPayload()
    this.setState({ userId: payload.sub, supportUser: payload.support })
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
    
    //identify if the user has logged in and has a token
    const isSupportMenu = this.state.supportUser
    const { incomingMessages } = this.props
    // console.log('passed props', incomingMessages)
    
    
    return (
      <Fragment>

        <header className={`navbar p-fixed ${isSupportMenu ? 'is-secondary' : 'is-base'}`}>

          <article className="navbar-section">
            {!isSupportMenu &&
              <div className="dropdown">
                <div className="btn-group">
                  <a className="btn btn-link dropdown-toggle" tabIndex="0">
                    &nbsp;Help <i className="icon icon-caret"></i>
                  </a>
                  <ul className="menu">
                    <li className="menu-item">
                      <a href="#"><i className="icon icon-search"></i> &nbsp;FAQs</a>
                    </li>
                  </ul>
                </div>
              </div>
            }
          </article>

          <article className="navbar-center">
            {isSupportMenu &&
              <h1 className="title">p&#305;coBank support centre</h1>
            }
            {!isSupportMenu &&
              <Link to='/' className="">
                <h1 className="title">p&#305;coBank</h1>
              </Link>
            }
          </article>


          <article className="navbar-section">
            <div className="dropdown dropdown-right">
              
              {Auth.isAuthenticated() &&
                <div className="btn-group">
                  {!!incomingMessages.count &&
                    <a className="btn btn-link dropdown-toggle badge" data-badge={incomingMessages.count} tabIndex="0">
                      <i className="icon icon-people"></i>
                    </a>
                  }
                  {!incomingMessages.count &&
                    <a className="btn btn-link dropdown-toggle" tabIndex="0">
                      <i className="icon icon-people"></i>
                    </a>
                  }
                  {!isSupportMenu &&
                  <ul className="menu">
                    <li className="menu-item">
                      <Link to='/banking'><i className="icon icon-copy"></i> &nbsp;Your Accounts</Link>
                      <Link to='/link'><i className="icon icon-copy"></i> &nbsp;Link and view Account settings</Link>
                    </li>
                    <li className="divider"></li>
                    {!!incomingMessages.count &&
                      <li className="menu-item">
                        <Link to='/message' className="active">
                          <label className="label label-primary">
                            {incomingMessages.count}
                          </label> &nbsp;You have {incomingMessages.count > 1 ? 'unread messages' : 'an unread message'}
                        </Link>
                      </li>
                    }
                    <li className="menu-item">
                      <Link to='/message'><i className="icon icon-mail"></i> &nbsp;Send us a secure message</Link>
                    </li>
                    <li className="divider"></li>
                    <li className="menu-item">
                      <a onClick={this.logout}><i className="icon icon-shutdown"></i> &nbsp;Log out</a>
                    </li>
                  </ul>
                  }
                  {isSupportMenu &&
                  <ul className="menu">
                    <li className="menu-item">
                      <a onClick={this.logout}><i className="icon icon-shutdown"></i> &nbsp;Log out</a>
                    </li>
                  </ul>
                  }
                </div>
              }
            </div>

            {!Auth.isAuthenticated() &&
              <a href='#register-login' className="nav-link">Register | Log in</a>
            }
          </article>


        </header>

      </Fragment>
    )
  }
}

export default withRouter(Menu)
