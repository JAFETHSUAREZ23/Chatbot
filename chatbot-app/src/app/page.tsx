import Header from "./components/Header";
import Image from "next/image";
import chatbot from "./asssests/chatbot.png";

export default function Home() {
  return (
    <>
      <Header />
      <div className="container mt-5">
        <div className="row align-items-center">
          
          <div className="col-md-7">
            <h1 className="display-4 fw-bold">Welcome to ChatBotAI</h1>
            <p className="lead mt-3">
              Your reliable virtual assistant, ready to answer all your questions about tech, development, and more.
            </p>
          </div>

          <div className="col-md-5 text-center">
            <Image
              src={chatbot}
              alt="ChatBot Illustration"
              className="img-fluid"
              priority
            />
          </div>
        </div>
      </div>
    </>
  );
}
