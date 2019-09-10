import React, { Fragment } from 'react'
import axios from 'axios'
import Popup from '../common/Popup'

class Register extends React.Component {
  constructor() {
    super()


    this.state = { data: { email: '', password: '', password_confirmation: '' }, errors: {}, popup: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
  }

  clearPopup() {
    this.setState({ popup: '' })
  }

  handleChange(e) {
    const data = { ...this.state.data, [e.target.name]: e.target.value }
    const errors = { ...this.state.errors, [e.target.name]: null }
    this.setState({ data, errors })
  }

  handleRegister(e) {
    e.preventDefault()

    axios.post('/api/register', this.state.data)
      .then(res => {
        // console.log(res.data)
        this.setState({ data: { email: '', password: '', password_confirmation: '' }, errors: {}, popup: 'Registration succesful, please log in' })
      })
      .catch(err => {
        console.log(err.response.data)
        this.setState({ errors: err.response.data.errors })
      })
  }


  render() {
    const { errors, data } = this.state
    // console.log('errors in register:', errors)
    // console.log('popup messages:', this.state.popup)
    // console.log('data:', this.state.data)
    
    return (
      <Fragment>
        <Popup message={this.state.popup}/>
        <form onSubmit={this.handleRegister} className="form-horizontal">
          <h4 className="">Register</h4>

          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <div className="col-5 col-sm-12">
              <label className="form-label" htmlFor="email">Email</label>
            </div>
            <div className="col-7 col-sm-12">
              <input
                className="form-input"
                name="email"
                value={data.email}
                onChange={this.handleChange}
              />
              {errors.email && <small className="form-input-hint">{errors.email}</small>}
            </div>
          </div>

          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <div className="col-5 col-sm-12">
              <label className="form-label" htmlFor="password">Password</label>
            </div>
            <div className="col-7 col-sm-12">
              <input
                className="form-input"
                type="password"
                name="password"
                value={data.password}
                onChange={this.handleChange}
              />
              {errors.password && <small className="form-input-hint">{errors.password}</small>}
            </div>
          </div>

          <div className={`form-group ${errors.password_confirmation ? 'has-error' : ''}`}>
            <div className="col-5 col-sm-12">
              <label className="form-label" htmlFor="passwordConfirmation">Password confirmation</label>
            </div>
            <div className="col-7 col-sm-12">
              <input
                className="form-input"
                type="password"
                name="password_confirmation"
                value={data.password_confirmation}
                onChange={this.handleChange}
              />
              {errors.password_confirmation && <small className="form-input-hint">{errors.password_confirmation}</small>}
            </div>
          </div>

          <div className="form-group">
            <div className="col-5 col-sm-12">
            </div>
            <div className="col-7 col-sm-12">
              <button type="submit" className="btn">Submit</button>
            </div>
          </div>

        </form>
      </Fragment>
    )
  }
}

export default Register
