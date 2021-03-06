import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { subscribeToUserMessages, subscribeToSupportMessages } from './lib/Api'

import 'spectre.css'
import '../node_modules/spectre.css/dist/spectre-icons.css'
import './style.scss'
import Auth from './lib/Auth'

import Home from './components/common/Home'
import Banking from './components/accounts/Banking'
import LinkAccount from './components/accounts/LinkAccount'
import SecureMessaging from './components/messaging/SecureMessaging'
import SupportCentre from './components/support/SupportCentre'
import Menu from './components/common/Menu'
import NotFound from './components/common/NotFound'
import SecureCustomerRoute from './components/common/SecureCustomerRoute'
import SecureSupportRoute from './components/common/SecureSupportRoute'


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
        count: 0
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

      //add it if the current user equals the message user
      if (Auth.getPayload().sub === parseInt(newMessage.owner_id)){
        console.log('new message arrived')
        //add the new message into the state
        userMessages.messages.push(newMessage)      
        //add one to the user counter
        userMessages.count++
        this.setState({ userMessages })
      }
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

  clearUserMessages(){
    //clear the user count and messages
    this.setState({ userMessages: { messages: [], count: 0 } })
  }


  render(){
    // console.log('state:', this.state )
    
    return (
      <BrowserRouter>
        <main>
          <Menu incomingMessages={this.state.userMessages} />
          <Switch>
            <SecureSupportRoute exact path="/supportcentre" render={(props) => 
              <SupportCentre {...props} 
                incomingMessages={this.state.supportMessages} 
                clearMessages={this.clearSupportMessages} 
              />} 
            />

            <SecureCustomerRoute exact path="/message" render={(props) => 
              <SecureMessaging {...props} 
                incomingMessages={this.state.userMessages} 
                clearMessages={this.clearUserMessages} 
              />} 
            />

            {/* <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/> */}
            <SecureCustomerRoute exact path="/banking" component={Banking}/>
            <SecureCustomerRoute exact path="/link" component={LinkAccount}/>
            <Route exact path="/" component={Home}/>
            <Route path="/*" component={NotFound}/>
          </Switch>
        </main>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
