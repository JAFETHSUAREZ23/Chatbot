import ChatConversation from "../components/ChatConversation";
import ChatSidebar from "../components/ChatSideBar";
export default function ChatLayout() {
  return (
    <div className="container-fluid ">
      <div className="row vh-100 bg-light">
        <div className="col-auto p-0 bg-white">
          <ChatSidebar />
        </div>

        <div className="col bg-secondary.bg-gradient  overflow-auto">
        <ChatConversation />
        </div>
      </div>
    </div>
  );
}
