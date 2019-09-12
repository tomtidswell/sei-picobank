import React from 'react'
import axios from 'axios'
import Transactions from './Transactions'
import DoughnutOutgoing from './DoughnutOutgoing'
import DoughnutIncoming from './DoughnutIncoming'
import BalanceLine from './BalanceLine'
import ThisMonth from './ThisMonth'
import Auth from '../../lib/Auth'

// import { Link } from 'react-router-dom'


class Banking extends React.Component {
  constructor() {
    super()

    this.state = { 
      userId: Auth.getPayload().sub, 
      currentTab: 0, 
      accountTransactions: [],
      selectedDate: {
        month: new Date(Date.now()).getMonth(),
        year: new Date(Date.now()).getFullYear()
      }
    }
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
        //now we know we do have therefore we do have some accounts, so get the data for the first account
        if (userData.accounts.length > 0)
          return axios.get(`/api/accounts/${userData.accounts[0].id}/transactions`, {
            headers: { Authorization: `Bearer ${Auth.getToken()}` }
          })
      })
      .then(res => {
        //if we have user data but no accounts, push to the link page, where we will detect this state and show a message that for first time users without an account, the accounts need to be linked
        if (userData.accounts.length === 0){
          this.redirectToLink()
          return
        }

        const accountTransactions = res ? res.data : []
        this.setState({ userData, accountTransactions })
      })
      .catch(err => console.log(err))
  }

  switchTab(accountId, tabId){
    console.log('switching to', accountId)
    axios.get(`/api/accounts/${accountId}/transactions`, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(res => this.setState({ accountTransactions: res.data, currentTab: tabId }))
      .catch(err => console.log(err))
  }

  aggregateCategoriesAndSpend(transactions, type){
    //reduce the categories into an object to grab unique values
    return transactions.reduce((acc, trans) => {
      // filter by either credits or debits
      if (type === 'debits' && trans.amount > 0) return acc
      if (type === 'credits' && trans.amount < 0) return acc

      //make sure we include all categories
      trans.categories.forEach(({ category }) => {
        // either create the key or add to it
        category in acc ? acc[category] += trans.amount : acc[category] = trans.amount
        // get rid of those pesky floating point maths errors by rounding its multiple of 100, then dividing
        acc[category] = Math.round(acc[category] * 100) / 100
      })
      return acc
    },{})
  }

  categoryColourSettings(transactions){
    //reduce the categories into an object to grab unique values for colours
    return transactions.reduce((acc, trans) => {
      trans.categories.forEach(({ category, colour }) => {
        acc[category] = colour
      })
      return acc
    },{})
  }

  addRunningBalance(transactions){
    //inserts a running balance into each object
    return transactions.map((transaction, index) => {
      transaction.balance = index === 0 ? 
        transaction.amount :
        transactions[index - 1].balance + transaction.amount
      return transaction
    })
  }

  extractMonth(transactions){
    const { selectedDate } = this.state
    //filter out everything except this months data
    const thisMonth = transactions.filter(trans => 
      new Date(trans.formalDate).getMonth() === selectedDate.month && 
      new Date(trans.formalDate).getFullYear() === selectedDate.year
    )

    //identify what the next and previous months should be
    const prev = this.removeMonth(selectedDate)
    const next = this.addMonth(selectedDate)    

    //return an object including whether the next/previous months can be navigated to, and also a reduction for the incoming and outgoings
    return {
      transactions: thisMonth,
      outgoingTotal: thisMonth.reduce((acc, trans) => trans.amount < 0 ? acc += Math.abs(trans.amount) : acc, 0).toFixed(2),
      incomingTotal: thisMonth.reduce((acc, trans) => trans.amount > 0 ? acc += Math.abs(trans.amount) : acc, 0).toFixed(2),
      prev,
      next,
      prevOk: transactions.some(trans =>
        new Date(trans.formalDate).getMonth() === prev.month &&
        new Date(trans.formalDate).getFullYear() === prev.year
      ),
      nextOk: transactions.some(trans =>
        new Date(trans.formalDate).getMonth() === next.month &&
        new Date(trans.formalDate).getFullYear() === next.year
      )
    }
  }

  removeMonth(date){
    return {
      month: date.month === 0 ? 11 : date.month - 1,
      year: date.month === 0 ? date.year - 1 : date.year
    }
  }

  addMonth(date){
    return {
      month: date.month === 11 ? 0 : date.month + 1,
      year: date.month === 11 ? date.year + 1 : date.year 
    }
  }

  prevMonth(){
    const selectedDate = this.removeMonth(this.state.selectedDate)
    this.setState({ selectedDate })
  }

  nextMonth(){
    const selectedDate = this.addMonth(this.state.selectedDate)
    this.setState({ selectedDate })
  }

  redirectToLink(){
    this.props.history.push('/link')
  }



  render() {
    //return null the first time we render without user data
    if (!this.state.userData)
      return null

    // pull out the data from state
    const { userData } = this.state

    const accountTransactions = this.addRunningBalance(this.state.accountTransactions)
    const outgoingAggCat = this.aggregateCategoriesAndSpend(this.state.accountTransactions, 'debits')
    const incomingAggCat = this.aggregateCategoriesAndSpend(this.state.accountTransactions, 'credits')
    const catColours = this.categoryColourSettings(accountTransactions)
    const thisMonthData = this.extractMonth(accountTransactions)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    // console.log('user:', userData)
    // console.log('account:', accountTransactions)
    // console.log('this month:', thisMonthData)


    return (
      <section className="banking-page">
        <div className="hero hero-head">
          <h1 className="title">your p&#305;coBank accounts</h1>
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
                  All your spending. All items are grouped into categories. Click the categories to filter.
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
                  All money coming in. All items are grouped into categories. Click the categories to filter.
                </div>
              </div>
            </div>

            <div className="card chart">
              <div className="card-image">
                <BalanceLine accountTransactions={accountTransactions}/>
              </div>
              <div className="card-header">
                <div className="card-title h5">Account balance</div>
                <div className="card-subtitle text-gray">
                  <p>Your bank account balance changing over time.</p>
                  <p>
                    Your current balance is: £
                    {accountTransactions[accountTransactions.length - 1] &&
                    accountTransactions[accountTransactions.length - 1].balance.toFixed(2) }
                  </p>
                </div>
              </div>
            </div>

            <div className="card chart">
              <div className="card-image small-chart">
                <ThisMonth data={thisMonthData}/>
              </div>
              {thisMonthData.prevOk &&
                <figure 
                  className="avatar avatar-xs prev-month tooltip"
                  data-tooltip={months[thisMonthData.prev.month]}
                  onClick={()=>this.prevMonth()}
                  data-initial="<">
                </figure>
              }
              {thisMonthData.nextOk &&
                <figure 
                  className="avatar avatar-xs next-month tooltip"
                  data-tooltip={months[thisMonthData.next.month]}
                  onClick={()=>this.nextMonth()}
                  data-initial=">">
                </figure>
              }

              <div className="card-header">
                <div className="card-title h5">
                  {months[this.state.selectedDate.month]} 
                  {this.state.selectedDate.month === new Date(Date.now()).getMonth() ? ' so far' : ''} 
                </div>

                <div className="card-subtitle text-gray">
                  <p>Your total outgoings are: £{thisMonthData.outgoingTotal}</p>
                  <p>Your total incomings are: £{thisMonthData.incomingTotal}</p>
                  <p>Largest expense:&nbsp;
                    {thisMonthData.transactions.reduce((acc, trans )=> trans.amount < acc.amount ? trans : acc,{ amount: 0 }).description}
                  </p>
                </div>
              </div>

            </div>

          </div>
        }

        {/* <div className=""><h5>Your account breakdown</h5></div> */}
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
