import React from 'react'
import axios from 'axios'
// import { Link } from 'react-router-dom'


class Home extends React.Component {
  constructor() {
    super()

    this.state = { userId: 2, currentTab: 0 }
  }

  componentDidMount() {
    let userData = null
    let accountData = null
    axios.get(`/api/users/${this.state.userId}`)
      .then(res => {
        userData = res.data
        // console.log(userData.accounts[0].id)
        if(userData.accounts.length)
          return axios.get(`/api/accounts/${userData.accounts[0].id}`)
      })
      .then(res => {
        accountData = res ? res.data : null
        this.setState({ userData, accountData })
      })
      .catch(err => console.log(err))
  }

  switchTab(accountId){
    console.log('switching to', accountId)
    axios.get(`/api/accounts/${accountId}`)
      .then(res => this.setState({ accountData: res.data }))
      .catch(err => console.log(err))
  }

  render() {
    console.log('user:',this.state.userData)
    console.log('account:',this.state.accountData)
    if(!this.state.userData || !this.state.accountData)
      return null
    const {userData, accountData} = this.state

    return (
      <section className="banking-page">
        <div className="hero bank-head">
          <h1 className="title">your picobank accounts</h1>
        </div>

        <ul className="tab tab-block">

          {userData.accounts.map((account, index) => (
            <li
              onClick={()=>this.switchTab(account.id)}
              className={`tab-item ${index === 0 ? 'active' : '' }`}
              key={index}>
              <a className="">{account.type}</a>
            </li>
          ))}

        </ul>

        <div>
          <p>Your transactions</p>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>In</th>
                <th>Out</th>
                <th>Balance</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {accountData.transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.date}</td>
                  <td>{transaction.description}</td>
                  <td>£{transaction.amount}</td>
                  <td>£{transaction.amount}</td>
                  <td>£</td>
                  <td>
                    {console.log(transaction.categories)}
                    {transaction.categories.map((category, index) => (
                      <span className={`chip is-${category.category.toLowerCase()}`} key={index}>
                        {category.category} <a href="#" className="btn btn-clear" aria-label="Close" role="button"></a>
                      </span>

                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </section>
    )
  }
}

export default Home
