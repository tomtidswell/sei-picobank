import React, {Component} from 'react'
import { Doughnut } from 'react-chartjs-2'

//template for the doughnut data, this will be replaced with the below...
const data = {
  labels: ['Red','Green','Yellow'],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: ['#FF6384','#36A2EB','#FFCE56']
  }]
}


function extractData(aggCat, catColours){
  const labels = []
  const colours = []
  const data = []

  Object.keys(aggCat).forEach(category => {
    data.push(aggCat[category])
    labels.push(category)
    colours.push(catColours[category])
  })

  return {
    labels,
    colours,
    data
  }
}

class DoughnutIncoming extends Component {
  render() {
    // console.log('catcol', this.props.catColours)
    const graphData = extractData(this.props.aggCat, this.props.catColours)
    data.labels = graphData.labels
    data.datasets[0].data = graphData.data
    data.datasets[0].backgroundColor = graphData.colours
    // console.log('labels',data.labels)
    // console.log('data',data.datasets[0].data)
    // console.log('colours',data.datasets[0].backgroundColor)

    return (
      <Doughnut
        data={data}
        redraw={false}
        options={{ responsive: true, maintainAspectRatio: true }}/>
    )
  }
}

export default DoughnutIncoming
