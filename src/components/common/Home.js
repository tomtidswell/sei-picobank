import React from 'react'
// import { Link } from 'react-router-dom'

import Register from '../auth/Register'
import Login from '../auth/Login'

class Home extends React.Component {
  render() {
    return (
      <section className="home-page">
        <div className="hero is-base">
          <h2 className="subtitle">We&apos;re different</h2>
          <p>Laurem ipsum</p>
          <div>
            <button className="btn">Sign up in a snap</button>
          </div>

        </div>


        <div className="hero bg-gray">
          <h2 className="subtitle">Up and running in no time</h2>
          <p>Just a few steps and you&apos;ll be up and running</p>
          <ul className="step">
            <li className="step-item">
              <a href="#" className="tooltip" data-tooltip="Apply online">Submit an application online for an account</a>
            </li>
            <li className="step-item">
              <a href="#" className="tooltip" data-tooltip="We&apos;ll be in touch">We&apos;ll send you your account details</a>
            </li>
            <li className="step-item active">
              <a href="#" className="tooltip" data-tooltip="Link account">Log in and link your new account</a>
            </li>
            <li className="step-item">
              <a href="#" className="tooltip" data-tooltip="All set!">You&apos;re all set!</a>
            </li>
          </ul>
        </div>


        <div className="hero hero-sm">
          <h2 className="subtitle">Register to manage your account online, or log in</h2>
          <div className="columns">
            <div className="column">
              <Register />
            </div>
            <div className="divider-vert" data-content="OR"></div>
            <div className="column">
              <Login />
            </div>
          </div>
        </div>

        <div className="hero bg-gray">
          <h2 className="subtitle">Dont just take our word for it!</h2>
          <blockquote>
            <p>Something that someone said once that we spun and then spun again</p>
            <cite>- A. Customer</cite>
          </blockquote>
        </div>


      </section>
    )
  }
}

export default Home
