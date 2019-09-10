import React, { useState } from 'react'

//I'm using react hooks here to simplify the hiding of this popup, and keep the popup as a functional component, but add state to it

const NewMessageModal = ({ message }) => {
  
  //destructure the message, and the update function, and pass in the initial value of message
  const [popupMessage, setPopupMessage] = useState(message)
  const [showPopup, setShowPopup] = useState(true)

  //detect if we had a change of message coming in, and update as appropriate
  if (message !== popupMessage) setPopupMessage(message)


  // console.log('passed in:', message )
  // console.log('stateful:', popupMessage )
  // console.log('are they the same?:', message === popupMessage )
  
  
  //dont return the toast if the message is null, or the popup has been closed
  if (!popupMessage || !showPopup) return null

  //otherwise return the toast with the state based message
  return (
    <div className="toast">
      <button className="btn btn-clear float-right" onClick={()=>setShowPopup(false)}></button>
      {popupMessage}
    </div>
  )
}


export default NewMessageModal
