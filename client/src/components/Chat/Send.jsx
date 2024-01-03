import { useState, useContext } from "react";
import AppContext from "../../utils/AppContext";
import '../../App.css'
const Send = () => {

  const { text, getSocket } = useContext(AppContext)


  const [userMsg, setText] = useState("");


  const sendMessage = () => {
    if (userMsg.trim() !== "") {
      // getSocket().emit("newMsgToServer", { userMsg, username: sessionStorage.getItem("username") })
      if(getSocket()){
        getSocket().emit("emitToRoom", sessionStorage.getItem("roomId"),userMsg, sessionStorage.getItem("username") )
      }
      setText(""); // Clear the input after sending the message
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents new line on Enter without Shift
      sendMessage();
    }
  };

  return (
    <div className="msg-box1">
      <textarea
        value={userMsg}
        onChange={(e) => setText(e.target.value)}
        onKeyUp={handleKeyPress}
        className="ip-msg1"
        placeholder="Type your message..."
      ></textarea>
      <button
        onClick={sendMessage}
        className="botbtn"
      >
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.5 9H3.5" stroke="#5F6379" stroke-width="1.5" stroke-linecap="round"></path> <path d="M5 15L4 15" stroke="#5F6379" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4 12H2" stroke="#5F6379" stroke-width="1.5" stroke-linecap="round"></path> <path d="M12.0409 12.7649C12.4551 12.7649 12.7909 12.4291 12.7909 12.0149C12.7909 11.6007 12.4551 11.2649 12.0409 11.2649V12.7649ZM9.26797 12.7649H12.0409V11.2649H9.26797V12.7649Z" fill="#5F6379"></path> <path d="M11.8369 4.80857L12.1914 4.14766L11.8369 4.80857ZM20.5392 9.47684L20.1846 10.1377L20.5392 9.47684ZM20.5356 14.5453L20.8891 15.2068L20.5356 14.5453ZM11.8379 19.1934L11.4844 18.5319H11.4844L11.8379 19.1934ZM8.13677 15.7931L7.41828 15.578L8.13677 15.7931ZM8.13127 8.2039L7.41256 8.41827L8.13127 8.2039ZM9.18255 11.7286L8.46384 11.9429L9.18255 11.7286ZM11.4823 5.46948L20.1846 10.1377L20.8937 8.81593L12.1914 4.14766L11.4823 5.46948ZM20.1821 13.8839L11.4844 18.5319L12.1914 19.8548L20.8891 15.2068L20.1821 13.8839ZM8.85526 16.0082L9.90074 12.5163L8.46376 12.0861L7.41828 15.578L8.85526 16.0082ZM9.90126 11.5142L8.84998 7.98954L7.41256 8.41827L8.46384 11.9429L9.90126 11.5142ZM11.4844 18.5319C10.7513 18.9237 9.98824 18.7591 9.44091 18.2563C8.88829 17.7486 8.58451 16.9125 8.85526 16.0082L7.41828 15.578C6.97411 17.0615 7.47325 18.4855 8.4261 19.3609C9.38423 20.2411 10.8292 20.5828 12.1914 19.8548L11.4844 18.5319ZM20.1846 10.1377C21.6065 10.9005 21.6046 13.1236 20.1821 13.8839L20.8891 15.2068C23.3683 13.8819 23.3707 10.1447 20.8937 8.81593L20.1846 10.1377ZM12.1914 4.14766C10.8301 3.41739 9.38432 3.75692 8.42486 4.63604C7.47072 5.5103 6.96983 6.93392 7.41256 8.41827L8.84998 7.98954C8.5801 7.08467 8.88494 6.24894 9.43821 5.74199C9.98618 5.23991 10.7495 5.07638 11.4823 5.46948L12.1914 4.14766ZM9.90074 12.5163C9.9986 12.1895 9.99878 11.8412 9.90126 11.5142L8.46384 11.9429C8.47777 11.9896 8.47774 12.0394 8.46376 12.0861L9.90074 12.5163Z" fill="#5850c0"></path> </g></svg>      </button>
    </div>
  );
};

export default Send;
