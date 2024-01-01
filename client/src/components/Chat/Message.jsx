import Prism from 'prismjs';
import 'prismjs/themes/prism.css';


const Message = ({ isMyMessage, text }) => {
  const messageClasses = isMyMessage === sessionStorage.getItem("username")
    ? "bg-purple-600 text-white rounded-lg py-2 px-4 my-1 mx-4 max-w-xs break-all"
    : "bg-gray-300 text-gray-700 rounded-lg py-2 px-4 my-1 mx-4 max-w-xs break-all";

  const messageContainerClasses = isMyMessage === sessionStorage.getItem("username")
    ? "flex justify-end"
    : "flex justify-start";

  return (
    <div className={messageContainerClasses}>
      {isMyMessage != sessionStorage.getItem("username") && (
        <div className=" w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-2">
          {sessionStorage.getItem("username")}
        </div>
      )}
     
      <pre className={messageClasses}>{text}</pre>
      {isMyMessage === sessionStorage.getItem("username") && (
        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center ml-2">
          ME
        </div>
      )}
    </div>
  );
};

export default Message;
