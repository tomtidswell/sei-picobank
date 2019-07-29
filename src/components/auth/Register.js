import React from 'react'
import axios from 'axios'

class Register extends React.Component {
  constructor() {
    super()


    this.state = { data: {}, errors: {} }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    const data = { ...this.state.data, [e.target.name]: e.target.value }
    const errors = { ...this.state.errors, [name]: '' }
    this.setState({ data, errors })
  }

  handleSubmit(e) {
    e.preventDefault()

    axios.post('/api/register', this.state.data)
      .then(() => this.props.history.push('/login'))
      .catch(err => this.setState({ errors: err.response.data.errors }))
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit} className="form-horizontal">
        <h4 className="">Register</h4>


        <div className="form-group">
          <div className="col-5 col-sm-12">
            <label className="form-label" htmlFor="email">Email</label>
          </div>
          <div className="col-7 col-sm-12">
            <input
              className={`input ${this.state.errors.email ? 'is-danger' : ''}`}
              name="email"
              onChange={this.handleChange}
            />
          </div>
          {this.state.errors.email && <small className="help is-danger">{this.state.errors.email}</small>}
        </div>

        <div className="form-group">
          <div className="col-5 col-sm-12">
            <label className="form-label" htmlFor="password">Password</label>
          </div>
          <div className="col-7 col-sm-12">
            <input
              className={`input ${this.state.errors.password ? 'is-danger' : ''}`}
              type="password"
              name="password"
              onChange={this.handleChange}
            />
          </div>
          {this.state.errors.password && <small className="help is-danger">{this.state.errors.password}</small>}
        </div>

        <div className="form-group">
          <div className="col-5 col-sm-12">
            <label className="form-label" htmlFor="passwordConfirmation">Password confirmation</label>
          </div>
          <div className="col-7 col-sm-12">
            <input
              className={`input ${this.state.errors.passwordConfirmation ? 'is-danger' : ''}`}
              type="password"
              name="passwordConfirmation"
              onChange={this.handleChange}
            />
          </div>
          {this.state.errors.passwordConfirmation && <small className="help is-danger">{this.state.errors.bio}</small>}
        </div>

        <div className="form-group">
          <div className="col-5 col-sm-12">
          </div>
          <div className="col-7 col-sm-12">
            <button type="submit" className="btn">Submit</button>
          </div>
          {this.state.errors.passwordConfirmation && <small className="help is-danger">{this.state.errors.bio}</small>}
        </div>


      </form>
    )
  }
}

export default Register
