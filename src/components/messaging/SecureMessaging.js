import React from 'react'
import axios from 'axios'
import Time from '../../lib/Time'
// import { Link } from 'react-router-dom'
import NewMessageModal from './NewMessageModal'
import Auth from '../../lib/Auth'

class SecureMessaging extends React.Component {
  constructor() {
    super()

    this.state = { 
      userId: Auth.getPayload().sub, 
      currentTab: 'inbox', 
      allMessages: [], 
      newMessageData: {}, 
      modalActive: false 
    }
    
    this.handleChange = this.handleChange.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  componentDidMount() {
    axios.get(`/api/users/${this.state.userId}/messages`)
      .then(res => {
        console.log(res.data)
        const allMessages = res.data ? res.data : []
        this.setState({ allMessages })
      })
      .catch(err => console.log(err))
  }

  switchTab(tab){
    this.setState({ currentTab: tab })
  }

  archiveMessage(message){
    console.log(`archiving ${message}`)
    axios.post(`/api/users/${this.state.userId}/messages/${message}/archive`)
      .then(res => {
        const allMessages = res.data ? res.data : []
        this.setState({ allMessages })
      })
      .catch(err => console.log(err))
  }

  handleSendMessage(){
    const { newMessageData } = this.state
    axios.post(`/api/users/${this.state.userId}/messages`,{
      ...newMessageData, owner_id: this.state.userId.toString()
    })
      .then(res => {
        const allMessages = res.data ? res.data : []
        this.setState({ allMessages, newMessageData: {}, modalActive: false })
      })
      .catch(err => console.log(err))
  }

  handleChange({ target: { value, name }}){
    const newMessageData = { [name]: value }
    this.setState({ newMessageData })
  }

  toggleModal(){
    this.setState({ modalActive: !this.state.modalActive })
  }



  render() {
    //as well as destructuring, filter out only those for the current user selected, and add it back in to the master object incomingMessages
    const { incomingMessages } = this.props
    incomingMessages.currentUserMessages =
      incomingMessages.messages.filter(message => parseInt(message.owner_id) === userId)
    const { allMessages, currentTab, newMessageData } = this.state
    const messages = allMessages.filter(message => {
      if(currentTab === 'inbox' && !message.archived) return true
      if(currentTab === 'archive' && message.archived) return true
    })

    // console.log('messages', messages)
    // console.log('tab:', currentTab)
    // console.log(this.state.newMessageData)

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


        <figure
          className="avatar avatar-xl new-message tooltip tooltip-left"
          onClick={()=>this.toggleModal()}
          data-tooltip="Send us a new message">+
        </figure>

        <NewMessageModal
          handleSendMessage={this.handleSendMessage}
          handleChange={this.handleChange}
          newMessageData={newMessageData}
          modalActive={this.state.modalActive}
          toggleModal={this.toggleModal}
        />



        {messages.length > 0 &&
          <div className="messages">
            {messages.map((msg, index) => (
              <div className={`card message ${msg.incoming ? '' : 'my-message'}`} key={index}>
                <div className="card-header">
                  <div className="card-title h5">{msg.text}</div>
                  <div className="card-subtitle text-gray">
                    <a className="archive" onClick={()=>this.archiveMessage(msg.id)}>
                      {currentTab === 'archive' ? 'Send to inbox' : 'Archive' }
                    </a>
                    &nbsp;| {msg.incoming ? 'Received' : 'Sent'}&nbsp;
                    {Time.timeSince(msg.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        }

        {messages.length === 0 &&
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

      </section>
    )
  }
}

export default SecureMessaging
