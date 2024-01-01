import { useState, useContext } from "react";
import AppContext from "../../utils/AppContext";

const Send = () => {

  const { text, getSocket } = useContext(AppContext)


  const [userMsg, setText] = useState("");


  const sendMessage = () => {
    if (userMsg.trim() !== "") {
      getSocket().emit("newMsgToServer", { userMsg, username: sessionStorage.getItem("username") })
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
    <div className="flex items-center ">
      <textarea
        value={userMsg}
        onChange={(e) => setText(e.target.value)}
        onKeyUp={handleKeyPress}
        className="align-middle border border-gray-300 rounded-lg px-3 py-2 focus:outline-none placeholder-gray-500 text-gray-700 resize-none"
        placeholder="Type your message..."
      ></textarea>
      <button
        onClick={sendMessage}
        className="self-end rounded-lg bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white px-4 py-2 ml-2 transition duration-300 ease-in-out hover:from-purple-600 hover:to-blue-600 focus:outline-none"
      >
        SEND
      </button>
    </div>
  );
};

export default Send;
