import React, {Component} from 'react'
import { Line } from 'react-chartjs-2'

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Balance',
      fill: true,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
}
//
const options = {
  scales: {
    xAxes: [{
      type: 'time',
      time: {
        unit: 'day',
        tooltipFormat: 'ddd DD MMM'
      }
    }],
    yAxes: [{
      ticks: {
        suggestedMin: 0
      }
    }]
  }
}


console.log('labels',data.labels)


function extractData(transactions){
  // const labels = []

  const points = transactions.map(trans => {
    return {
      t: new Date(trans.formalDate),
      y: trans.balance
    }
  })
  const labels = transactions.map(trans => {
    return new Date(trans.formalDate)
  })

  console.log('time formatted',points)
  //only add the first and last date, and a centre point if there are more than 4 datapoints
  labels.push(new Date(transactions[0].formalDate))
  // if(transactions.length > 4) labels.push(transactions[Math.floor(transactions.length/2)].date)
  // labels.push(transactions[transactions.length-1].date)

  return { data: points, labels }
}


class BalanceLine extends Component {
  render() {
    const graphData = extractData(this.props.accountTransactions)
    data.labels = graphData.labels
    data.datasets[0].data = graphData.data

    console.log('labels',data.labels)
    console.log('line data',data.datasets[0].data)


    var ref = 'chart'
    return (
      <Line ref={ref} data={data} options={options}/>
    )
  }
}

export default BalanceLine
