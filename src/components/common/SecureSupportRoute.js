import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Auth from '../../lib/Auth'

const SecureRoute = ({ component: Component, ...rest }) => {
  // console.log('support user:', Auth.getPayload().support)
  // console.log('is authenticated:', Auth.isAuthenticated())
  
  // authenticated and is a customer
  if (Auth.isAuthenticated() && !Auth.getPayload().support) 
    return <Redirect to="/banking" />
  
  // authenticated and is a support user
  if (Auth.isAuthenticated() && Auth.getPayload().support) 
    return <Route {...rest} component={Component} />
  
  //else
  Auth.logout()
  return <Redirect to="/" />
}

export default SecureRoute
