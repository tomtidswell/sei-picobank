import React from 'react'
import axios from 'axios'
import Time from '../../lib/Time'
import Auth from '../../lib/Auth'

class SecureMessaging extends React.Component {
  constructor() {
    super()
    this.scrollElement = React.createRef()
    this.inputElement = React.createRef()
    this.state = { 
      userId: Auth.getPayload().sub, 
      currentTab: 'inbox', 
      allMessages: [], 
      newMessageData: { text: '' }, 
      modalActive: false 
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)

  }

  componentDidMount() {
    // clear the support messages in the props
    this.props.clearMessages()
    // then go fetch the messages
    axios.get(`/api/users/${this.state.userId}/messages`)
      .then(res => {
        // console.log(res.data)
        const allMessages = res.data ? res.data : []
        this.setState({ allMessages })
      })
      .catch(err => console.log(err))
  }

  componentDidUpdate(){
    this.scrollAndFocus()
  }

  switchTab(tab){
    this.setState({ currentTab: tab }, ()=>this.scrollAndFocus())
  }

  archiveMessage(message){
    // clear the support messages in the props
    this.props.clearMessages()
    // console.log(`archiving ${message}`)
    axios.post(`/api/users/${this.state.userId}/messages/${message}/archive`)
      .then(res => {
        const allMessages = res.data ? res.data : []
        this.setState({ allMessages })
      })
      .catch(err => console.log(err))
  }

  handleSendMessage(e){
    e.preventDefault()
    // clear the support messages in the props
    this.props.clearMessages()
    const { newMessageData } = this.state
    axios.post(`/api/users/${this.state.userId}/messages`,{
      ...newMessageData, owner_id: this.state.userId.toString()
    })
      .then(res => {
        const allMessages = res.data ? res.data : []
        // console.log('clearing:', newMessageData)
        newMessageData.text = ''
        this.setState({ allMessages, newMessageData, modalActive: false })
      })
      .catch(err => console.log(err))
  }

  handleChange({ target: { value, name } }){
    const newMessageData = { [name]: value }
    // console.log('message:', newMessageData)
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
    
    const { allMessages, currentTab, newMessageData } = this.state
    const { incomingMessages } = this.props
    

    const messages = allMessages.filter(message => {
      if (currentTab === 'inbox' && !message.archived) return true
      if (currentTab === 'archive' && message.archived) return true
    })

    // console.log('messages', messages)
    // console.log('tab:', currentTab)
    // console.log('messages state:', this.state)
    // console.log('incoming in state', incomingMessages)
    // console.log('current user:')

    return (
      <section className="message-page">
        <div className="hero message-head">
          <h1 className="title">your secure messages</h1>
        </div>

        <ul className="tab tab-block">
          <li
            onClick={()=>this.switchTab('inbox')}
            className={`tab-item ${currentTab === 'inbox' ? 'active' : '' }`}>
            <a className="">Inbox</a>
          </li>
          <li
            onClick={()=>this.switchTab('archive')}
            className={`tab-item ${currentTab === 'archive' ? 'active' : '' }`}>
            <a className="">Archived messages</a>
          </li>
        </ul>


        {(messages.length > 0 || incomingMessages.messages.length > 0) &&
          <div className="messages">
            {//map throught the data found in the database
              messages.map((msg, index) => (
                <div className={`card message ${msg.incoming ? '' : 'my-message'}`} key={index}>
                  <div className="card-header">
                    <div className="card-title">{msg.text}</div>
                    <div className="card-subtitle text-gray">
                      <a className="archive" onClick={()=>this.archiveMessage(msg.id)}>
                        {currentTab === 'archive' ? 'Send to inbox' : 'Archive' }
                      </a>
                      &nbsp;| {msg.incoming ? 'Received' : 'Sent'}&nbsp;
                      {Time.timeSince(msg.created_at)}
                    </div>
                  </div>
                </div>
              ))
            }
            {//add to the bottom by mapping through the currentUserMessages pulled in from the socket
              incomingMessages.messages.map((msg, index) => (
                <div className={`card message incoming-message ${msg.incoming ? '' : 'my-message'}`} key={index}>
                  <div className="card-header">
                    <div className="card-title">{msg.text}</div>
                    <div className="card-subtitle text-gray">
                      {msg.incoming ? 'Received' : 'Sent'} just now
                    </div>
                  </div>
                </div>
              ))
            }
            {<div id="end-of-messages" ref={this.scrollElement} ></div>}
          </div>
        }

        {/* {document.getElementById('end-of-messages').scrollIntoView()} */}

        {messages.length === 0 && incomingMessages.messages.length === 0 &&
          <div className="empty">
            <div className="empty-icon">
              <i className="icon icon-people"></i>
            </div>
            <p className="empty-title h5">You have no messages in your {currentTab}</p>
            <p className="empty-subtitle">Click the button to send a secure message to one of our support experts.</p>
            <div className="empty-action">
              <button className="btn btn-primary">Send a message</button>
            </div>
          </div>
        }

        {currentTab === 'inbox' &&
          <form className="message-form input-group" onSubmit={this.handleSendMessage}>
            <span className="input-group-addon addon-lg text-label">
              Send a secure message
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
              type="submit"
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
