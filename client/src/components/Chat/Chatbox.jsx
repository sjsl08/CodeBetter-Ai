import { useState, useEffect, useRef ,useContext} from 'react';
import Message from './Message';
import Send from './Send';
import Header from './Header';
import AppContext from '../../utils/AppContext';


const Chatbox = ({response}) => {


  const {messages} = useContext(AppContext)


  console.log(messages);
  
  const lastElem = useRef(null);

 

  const [expand, setExpand] = useState(false);

  useEffect(() => {
    const lastMessageElement = lastElem.current;
    if (lastMessageElement) {
      lastMessageElement.scrollIntoView();
    }
  }, [messages]);

  return (
    <div
      className={`h-screen border-2 border-gray-700 bg-gray-200 flex flex-col justify-between transition-all duration-500 ${
        expand ? 'w-full' : 'w-1/4' // Adjusted widths for transition
      }`}
    >
      <button onClick={() => setExpand(!expand)}>Toggle</button>
      <Header />
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
