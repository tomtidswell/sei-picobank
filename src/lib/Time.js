
class Time{
  static timeSince(timestamp){
    const timeStampDate = new Date(timestamp)
    const timeNow = new Date()
    const differential = timeNow - timeStampDate

    var daysDiff = Math.floor((differential) / (1000 * 60 * 60 * 24))
    if (daysDiff) return `${daysDiff}d ago`

    var hoursDiff = Math.floor((differential) / (1000 * 60 * 60))
    if (hoursDiff) return `${hoursDiff}h ago`

    var minsDiff = Math.floor((differential) / (1000 * 60))
    if (minsDiff) return `${minsDiff}m ago`

    //return 'just now' if the comment was less than 20s ago, otherwise return the number of seconds
    var secsDiff = Math.floor((differential) / (1000))
    if (secsDiff < 20) return 'Just now'
    if (secsDiff) return `${secsDiff}s ago`
  }
}

export default Time
