import { useState, useEffect, useRef ,useContext} from 'react';
import Message from './Message';
import Send from './Send';
import AppContext from '../../utils/AppContext';


const Chatbox = ({response,setAiTab,AiTab}) => {


  const {messages,getSocket} = useContext(AppContext)

  const socket = getSocket()
  const lastElem = useRef(null);




  const [expand, setExpand] = useState(false);

  useEffect(() => {
    const lastMessageElement = lastElem.current;
    if (lastMessageElement) {
      lastMessageElement.scrollIntoView();
    }
  }, [messages]);

  return (
    <div className={`flex w-50vw  max-h-[95vh] flex-col ${!AiTab && sessionStorage.getItem("username") != sessionStorage.getItem("roomId") ? "flex" : "hidden"}`}>
      <button onClick={() => setAiTab(true)}>Toggle</button>

      <div className="bg-gray-800 flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <Message key={index} isMyMessage={message.isMyMessage} text={message.text} userInitial={'A'} />
        ))}
        <div ref={lastElem}></div>
      </div>
      <div className="align-bottom">
        <Send  />
      </div>
    </div>
  );
};

export default Chatbox;
