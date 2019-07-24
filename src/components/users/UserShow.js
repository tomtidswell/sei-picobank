import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Auth from '../../lib/Auth'

class UserShow extends React.Component {
  constructor() {
    super()

    this.state = { user: null }
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    axios.get(`/api/users/${this.props.match.params.id}`)
      .then(res => this.setState({ user: res. data }))
      .catch(() => this.props.history.push('/notfound'))
  }


  handleDelete() {
    axios.delete(`/api/users/${this.props.match.params.id}  `, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(() => this.props.history.push('/'))
      .catch(err => console.log(err.response))
    console.log(`${this.props.match.params.id}`)
  }

  isOwner() {
    return Auth.getPayload().sub === this.state.user._id
  }
  render() {
    if (!this.state.user) return null
    const { user } =  this.state
    this.isOwner()
    return (
      <main className="section">
        <div className="profile-container form-container">
          <h2 className="form-title">{user.username}</h2>
          <figure className="profile-pic-container">
            <img src={user.picture} alt={user.name} className="profile-pic"/>
          </figure>
          <section className="profile-content">
            <p className="user-bio">{user.bio}</p>
            <hr />
          </section>
          {this.isOwner() &&
            <div>
              <button className="button profile-button">
                <Link
                  className="edit-link edit-button"
                  to={`/users/${user._id}/edit`}
                >
                  Edit
                </Link>
              </button>
              {this.isOwner() && <button onClick={this.handleDelete} className="button profile-button">Delete</button>}
            </div>
          }
        </div>
      </main>
    )
  }
}

export default UserShow
