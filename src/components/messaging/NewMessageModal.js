import React from 'react'

const NewMessageModal = ({ handleSendMessage, handleChange, newMessageData, modalActive, toggleModal }) => (
  <div className={`modal ${modalActive ? 'active' : ''}`} id="modal-id">
    <div className="modal-overlay"></div>
    <div className="modal-container">
      <div className="modal-header">
        <a className="btn btn-clear float-right" onClick={()=>toggleModal()}></a>
        <div className="modal-title h5">Compose a new secure message</div>
      </div>
      <div className="modal-body">
        <div className="content">
          <div className="form-group">
            <label className="form-label" htmlFor="text">Message</label>
            <textarea
              className="form-input"
              placeholder="Begin your message..."
              rows="6"
              onChange={handleChange}
              value={newMessageData.text}
              name="text" />
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn" onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  </div>
)


export default NewMessageModal
