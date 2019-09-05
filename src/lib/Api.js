import openSocket from 'socket.io-client'

console.log('attempting to launch socket')
var socket = openSocket.connect() //('/test')

// socket.on('connect', function (data) {
//   console.log('connected to a message server')
// })


// // socket.on('successfully saved', function (data) {
// //   console.log(data)
// // })

function subscribeToMessages(cb) {
  socket.on('new message', data => cb(data))
}


export { subscribeToMessages }






