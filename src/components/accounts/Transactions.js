import React from 'react'


const Transactions = ({userData, accountTransactions, currentTab}) => {

  if(!userData || !accountTransactions)
    return null

  console.log('user:',userData.email)
  console.log('current tab:',currentTab)
  console.log('account:',accountTransactions)

  return (
    <div>
      <h5>Your account breakdown</h5>
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
          {accountTransactions.map((transaction, index) => (
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
              <td>
                {transaction.categories.map((category, index) => (
                  <span
                    style={{backgroundColor: category.colour}}
                    className={`chip is-${category.category.toLowerCase()}`}
                    key={index}>
                    {category.category} <a href="#" className="btn btn-clear" aria-label="Close" role="button"></a>
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

export default Transactions
