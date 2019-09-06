import React from 'react'
import axios from 'axios'
import Time from '../../lib/Time'
// import { Link } from 'react-router-dom'
// import socket from '../../lib/Api'




class SecureMessaging extends React.Component {
  constructor() {
    super()

    // subscribeToMessages(newMessage => {
    //   const { incomingMessages } = this.state
    //   //add the new message into the state
    //   incomingMessages.messages.push(newMessage)      
    //   //add one to the user counter
    //   incomingMessages.userCounts[newMessage.owner_id] ? 
    //     incomingMessages.userCounts[newMessage.owner_id]++ : 
    //     incomingMessages.userCounts[newMessage.owner_id] = 1
    //   this.setState({ incomingMessages })
    // })

    this.state = { 
      userId: null, 
      allMessages: [], 
      newMessageData: { text: '' }, 
      allUsers: [], 
      incomingMessages: {
        messages: [],
        userCounts: {}
      } 
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)

  }

  componentDidMount() {

    // socket.on('connect', function (data) {
    //   console.log('connected to a message server')
    // })
    // socket.on('new message', function (data) {
    //   console.log('new message detected:', data)
    //   // console.log('the state:', this.state)
    //   // SecureMessaging.setState({ ...incomingMessages, })
    //   this.setState({ incomingMessages: 'hello' })
    // })


    // socket.on('successfully saved', function (data) {
    //   console.log(data)
    // })

    axios.get('/api/users')
      .then(res => {
        console.log(res.data)
        const allUsers = res.data ? res.data : []
        this.setState({ allUsers })
      })
      .catch(err => console.log(err))
  }

  switchUser(userId) {
    console.log(`switching to ${userId}`)
    // clear the user messages in the props
    this.props.clearUserMessages(userId)

    // get the data and save to state to switch users
    axios.get(`/api/users/${userId}/messages`)
      .then(res => {
        const allMessages = res.data ? res.data : []
        console.log(allMessages)
        this.setState({ allMessages, userId })
      })
      .catch(err => console.log(err))
  }

  handleSendMessage() {
    // clear the user messages in the props
    this.props.clearUserMessages(this.state.userId)
    
    const { newMessageData } = this.state
    axios.post(`/api/users/${this.state.userId}/messages`, {
      ...newMessageData, owner_id: this.state.userId.toString(), incoming: true
    })
      .then(res => {
        const allMessages = res.data ? res.data : []
        this.setState({ allMessages, newMessageData: { text: '' } })
      })
      .catch(err => console.log(err))
  }

  handleChange({ target: { value, name } }) {
    const newMessageData = { [name]: value }
    this.setState({ newMessageData })
  }


  render() {

    const { allMessages, newMessageData, allUsers, userId } = this.state

    //as well as destructuring, filter out only those for the current user selected, and add it back in to the master object incomingMessages
    const { incomingMessages } = this.props
    
    incomingMessages.currentUserMessages = 
      incomingMessages.messages.filter(message => parseInt(message.owner_id) === userId)

    // console.log('messages', allMessages)
    // console.log('props:', this.props)
    // console.log('incoming in state', incomingMessages)

    return (
      <section className="support-page">
        <div className="hero message-head">
          <h1 className="title">Customer Support Centre</h1>
        </div>

        <div className="message-body">
          <ul className="menu">
            <li className="divider" data-content="Customers"></li>
            {allUsers.length > 0 &&
              allUsers.map((user, index) => (
                <li
                  key={index}
                  onClick={() => this.switchUser(user.id)}
                  className="menu-item">
                  <a className={user.id === userId ? 'active' : ''}>{user.email}</a>
                  <div className="menu-badge">
                    {incomingMessages.userCounts[user.id] &&
                      <label className="label label-primary">
                        {incomingMessages.userCounts[user.id]}
                      </label>
                    }
                  </div>
                </li>
              ))
            }
          </ul>

          {allMessages.length > 0 &&
            <div className="messages">
              {//map throught the data found in the database
                allMessages.map((msg, index) => (
                  <div className={`card message ${msg.incoming ? 'my-message' : ''}`} key={index}>
                    <div className="card-header">
                      <div className="card-title h5">{msg.text}</div>
                      <div className="card-subtitle text-gray">
                        {msg.incoming ? 'Sent' : 'Received'}&nbsp;
                        {Time.timeSince(msg.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              {//add to the bottom by mapping through the currentUserMessages pulled in from the socket
                incomingMessages.currentUserMessages.map((msg, index) => (
                  <div className={`card message incoming-message ${msg.incoming ? 'my-message' : ''}`} key={index}>
                    <div className="card-header">
                      <div className="card-title h5">{msg.text}</div>
                      <div className="card-subtitle text-gray">
                        {msg.incoming ? 'Sent' : 'Received'} just now
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          }

          {allMessages.length === 0 &&
            <div className="empty">
              <div className="empty-icon">
                <i className="icon icon-people"></i>
              </div>
              <p className="empty-title h5">Choose a customer to begin</p>
              <p className="empty-subtitle">Once you have chosen a customer you will be able to send them a secure message</p>
            </div>
          }

        </div>

        {userId !== null &&
          <div className="message-bottom input-group">
            <span className="input-group-addon addon-lg">
              message {allUsers.filter(user => user.id === userId)[0].email}
            </span>
            <input
              type="text"
              className="form-input input-lg"
              placeholder="..."
              onChange={this.handleChange}
              value={newMessageData.text}
              name="text" />
            <button
              className="btn btn-lg btn-primary input-group-btn"
              onClick={this.handleSendMessage}>
              Submit
            </button>
          </div>
        }


      </section>
    )
  }
}

export default SecureMessaging
