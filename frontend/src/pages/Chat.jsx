import Sidebar from "../components/Chat/Sidebar"
import UserChat from "../components/Chat/UserChat"

import { useState } from "react"

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  return (
    <div style={{
      display : "flex"
    }}>
      <Sidebar onUserClick={setSelectedUser} />
      <UserChat selectedUser={selectedUser} />
    </div>
  )
}

export default Chat