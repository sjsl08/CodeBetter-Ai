import Prism from 'prismjs';
import 'prismjs/themes/prism.css';


const Message = ({ isMyMessage, text, userInitial }) => {
  const messageClasses = isMyMessage
    ? "bg-purple-600 text-white rounded-lg py-2 px-4 my-1 mx-4 max-w-xs break-all"
    : "bg-gray-300 text-gray-700 rounded-lg py-2 px-4 my-1 mx-4 max-w-xs break-all";

  const messageContainerClasses = isMyMessage
    ? "flex justify-end"
    : "flex justify-start";

  return (
    <div className={messageContainerClasses}>
      {!isMyMessage && (
        <div className=" w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-2">
          {userInitial}
        </div>
      )}
     
      <pre className={messageClasses}>{text}</pre>
      {isMyMessage && (
        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center ml-2">
          ME
        </div>
      )}
    </div>
  );
};

export default Message;
