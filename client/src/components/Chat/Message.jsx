import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import '../../App.css'

const Message = ({ isMyMessage, text }) => {

  console.log(isMyMessage);
  const messageClasses = isMyMessage === sessionStorage.getItem("username")
    ? "userText rounded-lg py-2 px-4 my-1 mx-4 max-w-xs break-all"
    : "botText rounded-lg py-2 px-4 my-1 mx-4 max-w-xs break-all";

  const messageContainerClasses = isMyMessage === sessionStorage.getItem("username")
    ? "flex justify-end"
    : "flex justify-start";

  return (
    <div  className={messageContainerClasses}>
      {isMyMessage != sessionStorage.getItem("username") && (
        <div className=" w-8 h-8 senderProfile rounded-full  flex items-center justify-center mr-2">
          {isMyMessage.toUpperCase()[0]}
        </div>
      )}
     
      <pre id='messageCon11' className={messageClasses}>{text}</pre>
      {isMyMessage === sessionStorage.getItem("username") && (
        <div className="w-8 h-8 rounded-full profilebg flex items-center justify-center ml-2">
          ME
        </div>
      )}
    </div>
  );
};

export default Message;
