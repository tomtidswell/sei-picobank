import React from 'react'
import axios from 'axios'
import Auth from '../../lib/Auth'

class Login extends React.Component {
  constructor() {
    super()

    this.state = { data: {}, error: ''  }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

  }

  handleChange({ target: { name, value } }) {
    const data = { ...this.state.data, [name]: value }
    const errors = { ...this.state.errors, [name]: '' }
    this.setState({ data, errors })
  }

  handleSubmit(e) {
    if (e)
      e.preventDefault()
    axios.post('/api/login', this.state.data)
      .then(res => {
        Auth.setToken(res.data.token)
        // console.log('login response:',res.data)
        console.log('is support', Auth.getPayload().support)

        Auth.getPayload().support ?
          this.props.history.push('/supportcentre') :
          this.props.history.push('/banking')

        window.scrollTo(0, 0)
      })
      .catch(err => {
        console.log(err)
        this.setState({ error: 'Invalid Crendentials' })
      })
  }

  render() {
    // console.log('login history', this.props.history)
    return (


      <form onSubmit={this.handleSubmit} className="form-horizontal">

        <h4 className="">Login</h4>

        <div className="form-group">
          <div className="col-3 col-sm-12">
            <label className="form-label" htmlFor="email">Email</label>
          </div>
          <div className="col-9 col-sm-12">
            <input
              className={`form-input ${this.state.error ? 'is-error' : ''}`}
              name="email"
              placeholder=""
              onChange={this.handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="col-3 col-sm-12">
            <label className="form-label" htmlFor="email">Password</label>
          </div>
          <div className="col-9 col-sm-12">
            <input
              className={`form-input ${this.state.error ? 'is-error' : ''}`}
              type="password"
              name="password"
              placeholder=""
              onChange={this.handleChange}
            />
          </div>
          {this.state.error && <small className="help is-error">{this.state.error}</small>}
        </div>

        <div className="form-group">
          <div className="col-3 col-sm-12"></div>
          <div className="col-9 col-sm-12">
            <button type="submit" className="btn is-error">Login</button>
          </div>
        </div>


      </form>
    )
  }

}

export default Login
