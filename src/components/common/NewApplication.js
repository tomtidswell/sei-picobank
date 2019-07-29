import React from 'react'

const NewMessageModal = ({modalActive, toggleModal}) => {

  return (
    <div className={`modal ${modalActive ? 'active' : ''}`} id="modal-id">
      <div className="modal-overlay"></div>
      <div className="modal-container">
        <div className="modal-header">
          <a className="btn btn-clear float-right" onClick={()=>toggleModal()}></a>
          <div className="modal-title h5">Apply online</div>
        </div>
        <div className="modal-body">
          <div className="content">
            This website doesnt actually let you apply for a bank account! Skip straight to the register step to be assigned a random account.
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={()=>toggleModal()}>OK</button>
        </div>
      </div>
    </div>
  )
}


export default NewMessageModal
