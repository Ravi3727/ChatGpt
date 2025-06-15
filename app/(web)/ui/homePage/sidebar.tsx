import ChatFeatures from "../sidebar/chatFeatures"
import PreviousChats from "../sidebar/previousChats"

function Sidebar() {
  return (
    <div className="h-full flex flex-col text-white ">
      {/* Top Section */}
      <div className="flex-shrink-0">
        <ChatFeatures />
      </div>

      {/* Scrollable Chat History */}
      <div className="flex-1 min-h-0">
        <PreviousChats />
      </div>
    </div>
  )
}

export default Sidebar