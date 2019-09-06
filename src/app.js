import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { subscribeToUserMessages, subscribeToSupportMessages } from './lib/Api'

import 'spectre.css'
import '../node_modules/spectre.css/dist/spectre-icons.css'
import './style.scss'

import Home from './components/common/Home'
import Banking from './components/accounts/Banking'
import LinkAccount from './components/accounts/LinkAccount'
import SecureMessaging from './components/messaging/SecureMessaging'
import SupportCentre from './components/support/SupportCentre'
import Menu from './components/common/Menu'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Footer from './components/common/Footer'
import NotFound from './components/common/NotFound'
import SecureRoute from './components/common/SecureRoute'


class App extends Component {
  constructor(){
    super()

    this.state = {
      supportMessages: {
        messages: [],
        userCounts: {}
      },
      userMessages: {
        messages: [],
        userCounts: {}
      }
    }

    this.clearUserMessages = this.clearUserMessages.bind(this)
    this.clearSupportMessages = this.clearSupportMessages.bind(this)

    subscribeToUserMessages(newMessage => {
      const { supportMessages } = this.state
      //add the new message into the state
      supportMessages.messages.push(newMessage)      
      //add one to the user counter
      supportMessages.userCounts[newMessage.owner_id] ? 
        supportMessages.userCounts[newMessage.owner_id]++ : 
        supportMessages.userCounts[newMessage.owner_id] = 1
      this.setState({ supportMessages })
    })

    subscribeToSupportMessages(newMessage => {
      const { userMessages } = this.state
      //add the new message into the state
      userMessages.messages.push(newMessage)      
      //add one to the user counter
      userMessages.userCounts[newMessage.owner_id] ? 
        userMessages.userCounts[newMessage.owner_id]++ : 
        userMessages.userCounts[newMessage.owner_id] = 1
      this.setState({ userMessages })
    })

  }

  clearSupportMessages(userId){
    const { supportMessages } = this.state
    // console.log('clearing', userId)
    //delete the user count
    delete supportMessages.userCounts[userId]
    //remove any messages
    supportMessages.messages = 
      supportMessages.messages.filter(message => parseInt(message.owner_id) !== userId)
    this.setState({ supportMessages })
  }

  clearUserMessages(userId){
    const { userMessages } = this.state
    // console.log('clearing', userId)
    //delete the user count
    delete userMessages.userCounts[userId]
    //remove any messages
    userMessages.messages = 
      userMessages.messages.filter(message => parseInt(message.owner_id) !== userId)
    this.setState({ userMessages })
  }


  render(){
    // console.log('state:', this.state )
    
    return (
      <BrowserRouter>
        <main>
          <Menu />
          <Switch>
            <Route exact path="/supportcentre" render={(props) => 
              <SupportCentre {...props} 
                incomingMessages={this.state.supportMessages} 
                clearUserMessages={this.clearSupportMessages} 
              />} 
            />

            <Route exact path="/message" render={(props) => 
              <SecureMessaging {...props} 
                incomingMessages={this.state.userMessages} 
                clearUserMessages={this.clearUserMessages} 
              />} 
            />

            <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/banking" component={Banking}/>
            <Route exact path="/link" component={LinkAccount}/>
            <Route exact path="/" component={Home}/>
            <Route path="/*" component={NotFound}/>
          </Switch>
        </main>
        <Footer />
      </BrowserRouter>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
