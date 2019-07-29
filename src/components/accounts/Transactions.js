import React from 'react'


class Transactions extends React.Component{
  constructor() {
    super()

    this.state = {
      filters: []
    }
    this.changeFilter = this.changeFilter.bind(this)
  }

  changeFilter(add,remove){
    let filters = this.state.filters
    if(add && !filters.some(item => item.category === add.category)){
      filters.push(add)
    }
    if(remove) {
      filters = filters.filter(filter => filter.category !== remove.category)
    }
    this.setState({ filters })
  }

  render(){

    const { userData, accountTransactions, currentTab } = this.props
    const { filters } = this.state
    let filteredTrans = accountTransactions

    if(!userData || !accountTransactions)
      return null

    //filter the transactions by the filter specified in the state
    if(filters.length > 0)
      filteredTrans = accountTransactions.filter(trans => {
        return trans.categories.some(cat => filters.some(filter => filter.category === cat.category))
      })

    console.log('user:',userData.email)
    console.log('current tab:',currentTab)
    console.log('account:',accountTransactions)

    return (
      <div>

        <div className="columns">
          <div className="column col-6"><h5>Your account breakdown</h5></div>
          <div className="column col-6 is-right">
            {this.state.filters.length > 0 ? 'Filter: ' : ''}
            {this.state.filters.map((filter, index) => (
              <span
                style={{backgroundColor: filter.colour}}
                className="chip"
                key={index}>
                {filter.category}
                <a className="btn btn-clear" role="button" onClick={()=>this.changeFilter(null,filter)}></a>
              </span>
            ))}
          </div>
        </div>


        <table className="table table-hover">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th className="currency">In</th>
              <th className="currency">Out</th>
              <th className="currency">Balance</th>
              <th className="is-right">Tags</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrans.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td className="text-right">
                  {transaction.amount >= 0 ? `£${transaction.amount.toFixed(2)}` : ''}
                </td>
                <td className="text-right">
                  {transaction.amount < 0 ? `£${Math.abs(transaction.amount).toFixed(2)}` : ''}
                </td>
                <td className="text-right">£{transaction.balance.toFixed(2)}</td>
                <td className="is-right">
                  {transaction.categories.map((category, index) => (
                    <span
                      style={{backgroundColor: category.colour}}
                      className='chip add-filter'
                      onClick={()=>this.changeFilter(category,null)}
                      key={index}>
                      {category.category}
                    </span>

                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Transactions
