import React from 'react'
// import { Link } from 'react-router-dom'


class Home extends React.Component {
  render() {
    return (
      <section className="banking-page">
        <div className="hero bank-head">
          <h1 className="title">your picobank accounts</h1>
        </div>

        <ul className="tab tab-block">
          <li className="tab-item">
            <a className="">Current Account 1</a>
          </li>
          <li className="tab-item">
            <a className="active">Current Account 2</a>
          </li>
          <li className="tab-item">
            <a className="">Credit Card</a>
          </li>
          <li className="tab-item">
            <a className="">Mortgage</a>
          </li>
        </ul>

        <div>
          <p>Your transactions</p>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Description</th>
                <th>In</th>
                <th>Out</th>
                <th>Balance</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              <tr className="">
                <td>Tesco shop</td>
                <td>£4.87</td>
                <td>-</td>
                <td>-£10.00</td>
                <td>Shopping, Supermarket</td>
              </tr>
              <tr className="active">
                <td>Tesco shop</td>
                <td>£4.87</td>
                <td>-</td>
                <td>-£10.00</td>
                <td>Shopping, Supermarket</td>
              </tr>
              <tr className="">
                <td>Tesco shop</td>
                <td>£4.87</td>
                <td>-</td>
                <td>-£10.00</td>
                <td>Shopping, Supermarket</td>
              </tr>
              <tr className="">
                <td>Tesco shop</td>
                <td>£4.87</td>
                <td>-</td>
                <td>-£10.00</td>
                <td>
                  <span className="chip">
                    Shopping <a href="#" className="btn btn-clear" aria-label="Close" role="button"></a>
                  </span>
                  <span className="chip">
                    Supermarket <a href="#" className="btn btn-clear" aria-label="Close" role="button"></a>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>


      </section>
    )
  }
}

export default Home
