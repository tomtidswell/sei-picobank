import React from 'react'
import axios from 'axios'

class Register extends React.Component {
  constructor() {
    super()


    this.state = { data: {}, errors: {}  }
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
      <form onSubmit={this.handleSubmit}>
        <h4 className="">Register</h4>
        <div className="field">
          <div className="control">
            <input
              className={`input ${this.state.errors.username ? 'is-danger' : ''}`}
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
            />
          </div>
          {this.state.errors.username && <small className="help is-danger">{this.state.errors.username}</small>}
        </div>

        <div className="field">
          <div className="control">
            <input
              className={`input ${this.state.errors.password ? 'is-danger' : ''}`}
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
            />
          </div>
          {this.state.errors.password && <small className="help is-danger">{this.state.errors.password}</small>}
        </div>
        <div className="field">
          <div className="control">
            <input
              className={`input ${this.state.errors.passwordConfirmation ? 'is-danger' : ''}`}
              type="password"
              name="passwordConfirmation"
              placeholder="Password Confirmation"
              onChange={this.handleChange}
            />
          </div>
          {this.state.errors.passwordConfirmation && <small className="help is-danger">{this.state.errors.bio}</small>}
        </div>
        <div className="field">
          <div className="control">
            <input
              className={`input ${this.state.errors.passwordConfirmation ? 'is-danger' : ''}`}
              type="bio"
              name="bio"
              placeholder="Write a small bio about yourself..."
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <input
              className="input"
              name="picture"
              placeholder="Image"
              onChange={this.handleChange}

            />
          </div>
        </div>
        {this.state.errors.passwordConfirmation && <small className="help is-danger">{this.state.errors.passwordConfirmation}</small>}
        <button type="submit" className="btn">Submit</button>
      </form>
    )
  }
}

export default Register
