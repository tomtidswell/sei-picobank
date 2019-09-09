import React from 'react'

const NotFound = ( prop ) => {
  
  // console.log('props', prop)
  
  setTimeout(() => {
    prop.history.push('/')
  }, 3000)

  return (
    <section className="empty">
      <div className="empty-icon">
        <i className="icon icon-people"></i>
      </div>
      <h1>Oh dear. We can&apos;t find that for you.</h1>
      <p className="empty-title h5">instead, we are sending you to our home page</p>
    </section>
  )

}



export default NotFound
