import React from 'react'

const Attachment = (props) => {
   const {attachment} = props;
  return (
    <div><a href={attachment.url} target="_blank" className='ticket_notes-attachment'>
    <div className="ticket_notes-attachment-img">
      <img src={`https://d2p078bqz5urf7.cloudfront.net/cloud/dev/assets/img/file-banner/${attachment.extension}.png`} />
    </div>
    <div className="ticket_notes-attachment-name">
      {attachment.title}
    </div>
  </a></div>
  )
}

export default Attachment