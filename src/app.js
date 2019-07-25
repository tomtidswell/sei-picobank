import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import 'spectre.css'
import '../node_modules/spectre.css/dist/spectre-icons.css'
import './style.scss'

import Home from './components/common/Home'
import Banking from './components/accounts/Banking'
import Menu from './components/common/Menu'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Footer from './components/common/Footer'
import NotFound from './components/common/NotFound'
import SecureRoute from './components/common/SecureRoute'


const App = () => {
  return (
    <BrowserRouter>
      <main>
        <Menu />
        <Switch>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/banking" component={Banking}/>
          <Route exact path="/" component={Home}/>
          <Route path="/*" component={NotFound}/>
        </Switch>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
