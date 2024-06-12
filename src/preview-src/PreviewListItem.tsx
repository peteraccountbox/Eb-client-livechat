import React from 'react'

const PreviewListItem = () => {
  return (
    
  <div
    className="empty_content"
  >
    <div style={{ marginRight: 8 }}>
      <div
        className="none_user"
        // style={{
        //   width: 40,
        //   height: 40,
        //   borderRadius: "50%",
        //   backgroundColor: "#F5F5F5"
        // }}
      />
    </div>
    <div className="user_chat" 
    // style={{ flexDirection: "column", flex: "1 1 auto" }}
    >
      <div className="user"
        // style={{
        //   width: "100%",
        //   height: 16,
        //   borderRadius: 24,
        //   backgroundColor: "#F5F5F5",
        //   marginBottom: 8
        // }}
      />
      <div className="msg" 
    //   style={{ flexDirection: "row", display: "flex" }}
      >
        <div className="recent"
        //   style={{
        //     width: 226,
        //     height: 16,
        //     borderRadius: 24,
        //     backgroundColor: "#F5F5F5"
        //   }}
        />
      </div>
    </div>
  </div>

  )
}

export default PreviewListItem