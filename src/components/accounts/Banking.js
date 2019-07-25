import React from 'react'
import axios from 'axios'
import Transactions from './Transactions'
import DoughnutOutgoing from './DoughnutOutgoing'
import DoughnutIncoming from './DoughnutIncoming'

// import { Link } from 'react-router-dom'


class Banking extends React.Component {
  constructor() {
    super()

    this.state = { userId: 1, currentTab: 0 }
  }

  componentDidMount() {
    let userData = null
    let accountTransactions = null
    axios.get(`/api/users/${this.state.userId}`)
      .then(res => {
        userData = res.data
        // console.log(userData.accounts[0].id)
        if(userData.accounts.length)
          return axios.get(`/api/accounts/${userData.accounts[0].id}/transactions`)
      })
      .then(res => {
        accountTransactions = res ? res.data : null
        this.setState({ userData, accountTransactions })
      })
      .catch(err => console.log(err))
  }

  switchTab(accountId, tabId){
    console.log('switching to', accountId)
    axios.get(`/api/accounts/${accountId}/transactions`)
      .then(res => this.setState({ accountTransactions: res.data, currentTab: tabId }))
      .catch(err => console.log(err))
  }

  aggregateCategoriesAndSpend(transactions, type){
    //reduce the categories into an object to grab unique values
    return transactions.reduce((acc, trans) => {
      // filter by either credits or debits
      if(type === 'debits' && trans.amount > 0) return acc
      if(type === 'credits' && trans.amount < 0) return acc

      //make sure we include all categories
      trans.categories.forEach(({category}) => {
        // either create the key or add to it
        category in acc ? acc[category] += trans.amount : acc[category] = trans.amount
        // get rid of those pesky floating point maths errors by rounding its multiple of 100, then dividing
        acc[category] = Math.round(acc[category]*100)/100
      })
      return acc
    },{})
  }

  categoryColourSettings(transactions){
    //reduce the categories into an object to grab unique values for colours
    return transactions.reduce((acc, trans) => {
      trans.categories.forEach(({category, colour}) => {
        acc[category] = colour
      })
      return acc
    },{})
  }

  addRunningBalance(transactions){
    //inserts a running balance into each object
    return transactions.map((transaction, index) => {
      index === 0
        ? transaction.balance = transaction.amount
        : transaction.balance = transactions[index-1].balance + transaction.amount
      return transaction
    })
  }



  render() {
    if(!this.state.userData || !this.state.accountTransactions)
      return null
    const {userData} = this.state
    let {accountTransactions} = this.state
    console.log('user:', userData)
    console.log('account:', accountTransactions)
    accountTransactions = this.addRunningBalance(accountTransactions)
    const outgoingAggCat = this.aggregateCategoriesAndSpend(this.state.accountTransactions, 'debits')
    const incomingAggCat = this.aggregateCategoriesAndSpend(this.state.accountTransactions, 'credits')
    const catColours = this.categoryColourSettings(accountTransactions)


    return (
      <section className="banking-page">
        <div className="hero bank-head">
          <h1 className="title">your picobank accounts</h1>
        </div>

        <ul className="tab tab-block">
          {//the tabs are mapped from the account data, index is the onClick
            userData.accounts.map((account, index) => (
              <li
                onClick={()=>this.switchTab(account.id, index)}
                className={`tab-item ${index === this.state.currentTab ? 'active' : '' }`}
                key={index}>
                <a className="">{account.type}</a>
              </li>
            ))}
        </ul>

        {accountTransactions.length > 0 &&
          //these graphs will extract the different categories against amounts spent, or income
          <div className="charts">
            <div className="card chart">
              <div className="card-image">
                <DoughnutOutgoing aggCat={outgoingAggCat} catColours={catColours}/>
              </div>
              <div className="card-header">
                <div className="card-title h5">Spending by category</div>
                <div className="card-subtitle text-gray">
                  Your transactions are grouped into the tags shown below
                </div>
              </div>
            </div>

            <div className="card chart">
              <div className="card-image">
                <DoughnutIncoming aggCat={incomingAggCat} catColours={catColours}/>
              </div>
              <div className="card-header">
                <div className="card-title h5">Income by category</div>
                <div className="card-subtitle text-gray">
                  Your transactions are grouped into the tags shown below
                </div>
              </div>
            </div>

          </div>
        }
        {accountTransactions.length > 0 &&
          <Transactions userData={userData} accountTransactions={accountTransactions}/>
        }

        {accountTransactions.length === 0 &&
          <div className="empty">
            <div className="empty-icon">
              <i className="icon icon-people"></i>
            </div>
            <p className="empty-title h5">You don&apos;t have any recent transactions</p>
            <p className="empty-subtitle">Do you want to make a payment?</p>
            <div className="empty-action">
              <button className="btn btn-primary">Make a payment</button>
            </div>
          </div>
        }

      </section>
    )
  }
}

export default Banking
