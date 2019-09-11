import React from 'react'
import axios from 'axios'
import Time from '../../lib/Time'
// import { Link } from 'react-router-dom'
// import socket from '../../lib/Api'




class SecureMessaging extends React.Component {
  constructor() {
    super()
    this.scrollElement = React.createRef()
    this.inputElement = React.createRef()

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
    axios.get('/api/users')
      .then(res => {
        // console.log(res.data)
        const allUsers = res.data ? res.data : []
        this.setState({ allUsers })
      })
      .catch(err => console.log(err))
  }

  componentDidUpdate() {
    this.scrollAndFocus()
  }

  switchUser(userId) {
    console.log(`switching to ${userId}`)
    // clear the user messages in the props
    this.props.clearMessages(userId)

    // get the data and save to state to switch users
    axios.get(`/api/users/${userId}/messages`)
      .then(res => {
        const allMessages = res.data ? res.data : []
        // console.log(allMessages)
        this.setState({ allMessages, userId }, ()=>this.scrollAndFocus())
      })
      .catch(err => console.log(err))
  }

  handleSendMessage(e) {
    e.preventDefault()
    // clear the user messages in the props
    this.props.clearMessages(this.state.userId)
    
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

  scrollAndFocus() {
    const eom = this.scrollElement.current
    const input = this.inputElement.current
    // this jumps to the bottom of the messages
    if (eom) eom.scrollIntoView({ block: 'end', behavior: 'smooth' })
    // this focusses the input
    if (input) input.focus()
  }


  render() {

    const { allMessages, newMessageData, userId } = this.state

    //filter out the support users - we dont need to send them any messages
    const allUsers = this.state.allUsers.filter(user => !user.support)

    //as well as destructuring, filter out only those for the current user selected, and add it back in to the master object incomingMessages
    const { incomingMessages } = this.props
    
    incomingMessages.currentUserMessages = 
      incomingMessages.messages.filter(message => parseInt(message.owner_id) === userId)

    // console.log('messages', allMessages)
    // console.log('props:', this.props)
    // console.log('incoming in state', incomingMessages)

    return (
      <section className="support-page">

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
                      <div className="card-title">{msg.text}</div>
                      <div className="card-subtitle text-gray">
                        {msg.incoming ? 'Sent' : 'Received'}&nbsp;
                        {Time.timeSince(msg.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              }
              {//add to the bottom by mapping through the currentUserMessages pulled in from the socket
                incomingMessages.currentUserMessages.map((msg, index) => (
                  <div className={`card message incoming-message ${msg.incoming ? 'my-message' : ''}`} key={index}>
                    <div className="card-header">
                      <div className="card-title">{msg.text}</div>
                      <div className="card-subtitle text-gray">
                        {msg.incoming ? 'Sent' : 'Received'} just now
                      </div>
                    </div>
                  </div>
                ))
              }
              {<div id="end-of-messages" ref={this.scrollElement}  ></div>}
            </div>
          }

          {userId === null &&
            <div className="empty">
              <div className="empty-icon">
                <i className="icon icon-people"></i>
              </div>
              <p className="empty-title h5">Choose a customer to begin</p>
              <p className="empty-subtitle">Once you have chosen a customer you will be able to send them a secure message</p>
            </div>
          }

          {userId !== null && allMessages.length === 0 && 
            <div className="empty">
              <div className="empty-icon">
                <i className="icon icon-people"></i>
              </div>
              <p className="empty-title h5">No messages</p>
              <p className="empty-subtitle">This customer has not sent any secure messages</p>
            </div>
          }

        </div>

        {userId !== null && 
          <form className="message-form input-group" onSubmit={this.handleSendMessage}>
            <span className="input-group-addon addon-lg  text-label">
              message {allUsers.filter(user => user.id === userId)[0].email}
            </span>
            <input
              type="text"
              className="form-input input-lg"
              placeholder="..."
              onChange={this.handleChange}
              value={newMessageData.text}
              ref={this.inputElement}
              autoComplete="off"
              name="text" />
            <button
              className="btn btn-lg btn-primary input-group-btn">
              Send
            </button>
          </form> 
        }


      </section>
    )
  }
}

export default SecureMessaging
