import { useState, useEffect, useRef, useContext } from 'react';
import Message from './Message';
import Send from './Send';
import AppContext from '../../utils/AppContext';
import '../../App.css'

import { motion } from "framer-motion"

const Chatbox = ({ response, setAiTab, AiTab }) => {


  const { messages, getSocket } = useContext(AppContext)

  const socket = getSocket()
  const lastElem = useRef(null);

  const springProps = {
    type: 'spring',
    damping: 10,
    stiffness: 100,
  };


  const [expand, setExpand] = useState(false);

  useEffect(() => {
    const lastMessageElement = lastElem.current;
    if (lastMessageElement) {
      lastMessageElement.scrollIntoView();
    }
  }, [messages]);

  return (
    <div className={`asidePanel   flex-col ${!AiTab && sessionStorage.getItem("username") != sessionStorage.getItem("roomId") ? "flex" : "hidden"}`}>
      <header className='botHeader' >

        <div className='roomHead'>Room Chat Id : {sessionStorage.getItem("roomId")}</div>
        <button onClick={() => setAiTab(true)} className='switchRoom1'>
          <svg fill="#5850c0" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns: xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml: space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M465.455,240.485v-77.576H279.273v-52.787c13.908-8.049,23.273-23.079,23.273-40.304c0-25.706-20.84-46.545-46.545-46.545 s-46.545,20.84-46.545,46.545c0,17.225,9.365,32.254,23.273,40.304v52.787H46.545v77.576H0v124.121h46.545v77.576h139.636v46.545 h139.636v-46.545h139.636v-77.576H512V240.485H465.455z M162.909,302.545c-17.136,0-31.03-13.892-31.03-31.03 c0-17.138,13.894-31.03,31.03-31.03s31.03,13.892,31.03,31.03C193.939,288.653,180.046,302.545,162.909,302.545z M256,418.909 c-38.56,0-69.818-31.258-69.818-69.818h139.636C325.818,387.651,294.56,418.909,256,418.909z M349.091,302.545 c-17.137,0-31.03-13.892-31.03-31.03c0-17.138,13.894-31.03,31.03-31.03c17.136,0,31.03,13.892,31.03,31.03 C380.121,288.653,366.227,302.545,349.091,302.545z"></path> </g> </g> </g></svg>
        </button>
      </header>
      <div className="vsDark midCon flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springProps, duration: 0.5 }}>
            <Message isMyMessage={message.isMyMessage} text={message.text} userInitial={'A'} />
          </motion.div>
        ))}
        <div ref={lastElem}></div>
      </div>
      <div className="align-bottom">
        <Send />
      </div>
    </div>
  );
};

export default Chatbox;
