import React from 'react'
import axios from 'axios'
import Auth from '../../lib/Auth'
// import { Link } from 'react-router-dom'


class LinkAccount extends React.Component {
  constructor() {
    super()

    this.state = { userId: Auth.getPayload().sub, currentTab: 'link', accountId: null, accSearch: { account: '' } }
    this.handleLinkRequest = this.handleLinkRequest.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    let userData = null

    //if we realise that we're not logged in, redirect to the home page
    if (!Auth.getToken()) this.props.history.push('/')

    axios.get(`/api/users/${this.state.userId}`,{
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(res => {
        userData = res.data
        this.setState({ userData })
      })
      .catch(err => console.log(err))
  }

  switchTab(tabId, accountId){
    console.log('switching to', tabId)

    this.setState({ currentTab: tabId, accountId })
  }

  handleLinkRequest(e){
    if (e) e.preventDefault()
    
    let userData = null
    axios.get('/api/accounts/link', {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    }, this.state.accSearch)
      .then(res => {
        userData = res.data
        this.setState({ userData })
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleChange({ target: { name, value } }) {
    const errors = { ...this.state.errors, [name]: '' }
    this.setState({ accSearch: { account: value }, errors })
  }




  render() {
    //return null the first time we render without user data
    if (!this.state.userData)
      return null

    // pull out the data from state
    const { userData, currentTab, accountId } = this.state
    const accountShown = userData.accounts.filter(account => account.id === accountId)[0]
    let accountType = ''

    if (accountShown)
      switch (accountShown.type) {
        case 'Current Account': accountType = 'current-account'
          break
        case 'Mortgage': accountType = 'mortgage'
          break
        case 'Credit Card': accountType = 'credit-card'
          break
      }

    console.log('data:', userData, 'tab:', currentTab, 'account:', accountShown)

    return (
      <section className="link-page">
        <div className="hero hero-sm hero-head">
          <h1 className="title">set up your p&#305;coBank accounts</h1>
        </div>

        <ul className="tab tab-block">
          {//the tabs are mapped from the account data, index is the onClick
            userData.accounts.map((account, index) => (
              <li
                onClick={()=>this.switchTab(index, account.id)}
                className={`tab-item ${index === this.state.currentTab ? 'active' : '' }`}
                key={index}>
                <a className="">{account.type}</a>
              </li>
            ))}
          <li
            onClick={()=>this.switchTab('link', null)}
            className={`tab-item ${this.state.currentTab === 'link' ? 'active' : '' }`}>
            <a className="">Link {userData.accounts.length === 0 ? 'an' : 'another'} account</a>
          </li>
        </ul>

        {currentTab === 'link' &&
          //this will render if the user selects the link tab
          <div className="empty">
            <div className="empty-icon">
              <i className="icon icon-people"></i>
            </div>
            {userData.accounts.length === 0 &&
              <p className="empty-title h5">You don&apos;t have any accounts linked to your user</p>
            }
            {currentTab === 'link' && userData.accounts.length > 0 &&
              <p className="empty-title h5">Add another account you have with us</p>
            }
            <p className="empty-subtitle">Just search for the account using the account number we sent to you.</p>
            <div className="empty-action">
              <div className="input-group">
                <span className="input-group-addon">Account Number</span>
                <input type="text"
                  className="form-input"
                  placeholder="eg. 01234567"
                  onChange={this.handleChange}
                  value={this.state.accSearch.account} />
                <button className="btn btn-primary input-group-btn" onClick={this.handleLinkRequest}>Search</button>
              </div>
            </div>
          </div>
        }


        {currentTab !== 'link' &&
          //this will render if the user has chosen to view an account
          <div className="cards">
            <div className="card">
              <div className="card-header">
                <div className="card-title h5">Your {accountShown.type}</div>
                <div className="card-subtitle text-gray">
                  {accountShown.nickname ? accountShown.nickname : 'You havent set a nickname for this account'}
                </div>
              </div>
              <div className={`card-image ${accountType}`}>
              </div>
            </div>
          </div>
        }



      </section>
    )
  }
}

export default LinkAccount
