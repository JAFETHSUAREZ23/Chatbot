import ChatConversation from "../components/ChatConversation";
import ChatSidebar from "../components/ChatSideBar";
export default function ChatLayout() {
  return (
    <div className="container-fluid  ">
      <div className="row vh-100 bg-light">
        <div className="col-auto p-0 ">
          <ChatSidebar />
        </div>

        <div className="col bg-dark-subtle  overflow-auto">
        <ChatConversation />
        </div>
      </div>
    </div>
  );
}
