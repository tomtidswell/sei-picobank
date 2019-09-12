import React, { Fragment } from 'react'
// import { Link } from 'react-router-dom'
import Register from '../auth/Register'
import Login from '../auth/Login'
import NewApplication from './NewApplication'
import Footer from './Footer'
import Auth from '../../lib/Auth'


class Home extends React.Component {
  constructor() {
    super()

    this.state = { application: false }
    this.toggleApplication = this.toggleApplication.bind(this)
  }

  toggleApplication(){
    this.setState({ application: !this.state.application })
  }



  render() {
    // console.log('homeprops', this.props)

    return (
      <Fragment> 
        <section className="home-page">

          <div className="hero hero-lg home-head">
            <div className="titles">
              <h2>
                <span className="text-base">We&apos;re</span>
                <span className="text-base">different</span>
              </h2>
              <p><span className="text-base">Understand your money and how you spend</span></p>
              <p><span className="text-base">Stay in control of your finances</span></p>
              <p><span className="text-base">We&apos;re here to help, message us any time</span></p>
            </div>
            <div className="bank-card">
              <h1 className="title">p&#305;coBank</h1>
              <h3 className="samp"><samp>0987 0987 0987 0987</samp></h3>
              <h6 className="kbd"><samp>R. WONDERFUL CUSTOMER</samp></h6>
            </div>
          </div>

          <div className="hero hero-sm is-right">
            <h5>Ready to take advantage or our top class features? </h5>
            <span>
              <button className="btn" onClick={()=>this.toggleApplication()}>Submit an application online</button> it only takes a few minutes.
            </span>
            <NewApplication modalActive={this.state.application} toggleModal={this.toggleApplication}/>
          </div>

          {!Auth.isAuthenticated() &&
            <div className="hero hero-sm">
              <h5 className="subtitle">Already applied for one of our amazing accounts? </h5>
              <span>
                <a className="btn" href="#register-login">Sign up now</a> to manage your account online and link your accounts.
              </span>
            </div>
          }


          <div className="hero bg-gray">
            <h2 className="subtitle">Up and running in no time</h2>
            <p>Just a few steps and you&apos;ll be up and running</p>
            <ul className="step">
              <li className="step-item">
                <a href="#" className="tooltip" data-tooltip="Apply online">
                  Submit an application online for an account
                </a>
              </li>
              <li className="step-item">
                <a href="#" className="tooltip" data-tooltip="We&apos;ll be in touch">
                  We&apos;ll send you your account details
                </a>
              </li>
              <li className="step-item active">
                <a href="#" className="tooltip" data-tooltip="Link account">
                  Register and link your new account
                </a>
              </li>
              <li className="step-item">
                <a href="#" className="tooltip" data-tooltip="All set!">
                  Login, and you&apos;re all set!
                </a>
              </li>
            </ul>
          </div>

          {!Auth.isAuthenticated() &&
            <div className="hero hero-sm" id="register-login">
              <h2 className="subtitle">Get started now!</h2>
              <div className="columns">
                <div className="column">
                  <Register />
                </div>
                <div className="divider-vert" data-content="OR"></div>
                <div className="column">
                  <Login history={this.props.history} />
                </div>
              </div>
            </div>
          }

          <div className="hero ducks is-right">
            <h2 className="subtitle"><span className="text-base">Get your finances organised</span></h2>
            <p><span className="text-base">Stay ahead of the pack with our easy-to-use insight into your monthly spending</span></p>
          </div>

          <div className="hero is-tertiary">
            <h2 className="subtitle">Dont just take our word for it</h2>
            <blockquote>
              <p>Something that someone said once that we spun and then spun again</p>
              <cite>- A. Customer</cite>
            </blockquote>
          </div>


        
        </section>
        <Footer />
      </Fragment>
    )
  }
}

export default Home
