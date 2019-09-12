import React, { Component } from 'react'
import { HorizontalBar } from 'react-chartjs-2'

const data = {
  labels: ['Outgoing', 'Incoming'],
  datasets: [
    {
      label: 'This month',
      backgroundColor: 'rgba(255,218,20,0.7)',
      borderColor: 'rgba(255,218,20,1)',
      data: []
    }
  ]
}
//
const options = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      barPercentage: 0.5,
      barThickness: 6,
      maxBarThickness: 8,
      minBarLength: 2,
      gridLines: {
        display: false
      },
      ticks: {
        suggestedMin: 0
      }
    }]
  }
}



class ThisMonth extends Component {
  render() {

    if (!this.props.data) return null
    
    // empty the data for when the chart is being redrawn
    data.datasets[0].data = []
    data.datasets[0].data.push(this.props.data.outgoingTotal)
    data.datasets[0].data.push(this.props.data.incomingTotal)
    
    var ref = 'chart'
    return (
      <HorizontalBar ref={ref} data={data} options={options}/>
    )
  }
}

export default ThisMonth
