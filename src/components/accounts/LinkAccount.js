import React from 'react'
import axios from 'axios'
import Auth from '../../lib/Auth'
// import { Link } from 'react-router-dom'


class LinkAccount extends React.Component {
  constructor() {
    super()

    this.state = { userId: Auth.getPayload().sub, currentTab: 'link' }
  }

  componentDidMount() {
    let userData = null

    //if we realise that we're not logged in, redirect to the home page
    if(!Auth.getToken()) this.props.history.push('/')

    axios.get(`/api/users/${this.state.userId}`,{
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(res => {
        userData = res.data

        this.setState({ userData })
      })
      .catch(err => console.log(err))
  }

  switchTab(tabId){
    console.log('switching to', tabId)

    this.setState({ currentTab: tabId })
  }



  render() {
    //return null the first time we render without user data
    if(!this.state.userData)
      return null

    // pull out the data from state
    const {userData} = this.state

    console.log(userData)

    return (
      <section className="banking-page">
        <div className="hero bank-head">
          <h1 className="title">your picobank accounts</h1>
        </div>

        <ul className="tab tab-block">
          {//the tabs are mapped from the account data, index is the onClick
            userData.accounts.map((account, index) => (
              <li
                onClick={()=>this.switchTab(index)}
                className={`tab-item ${index === this.state.currentTab ? 'active' : '' }`}
                key={index}>
                <a className="">{account.type}</a>
              </li>
            ))}
          <li
            onClick={()=>this.switchTab('link')}
            className={`tab-item ${this.state.currentTab === 'link' ? 'active' : '' }`}>
            <a className="">Link {userData.accounts.length === 0 ? 'an' : 'another'} account</a>
          </li>
        </ul>

        {userData.accounts.length === 0 &&
          //this will render if there are no accounts for the user
          <div className="empty">
            <div className="empty-icon">
              <i className="icon icon-people"></i>
            </div>
            <p className="empty-title h5">You don&apos;t have any accounts linked to your user</p>
            <p className="empty-subtitle">Do you want to search for an account?</p>
            <div className="empty-action">
              <button className="btn btn-primary">Search for an account</button>
            </div>
          </div>
        }



      </section>
    )
  }
}

export default LinkAccount
