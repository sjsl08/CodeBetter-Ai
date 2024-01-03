import React, { useState, useRef, useEffect, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import theme from 'react-syntax-highlighter/dist/esm/styles/prism/synthwave84';
import AppContext from '../../utils/AppContext';
import '../../App.css'


const Ai = ({ setAiTab, AiTab }) => {


    const { generateContent, generateResponse } = useContext(AppContext)

    const [loading, setLoading] = useState(false)

    const [messages, setMessages] = useState([
        { id: 1, text: 'This is an AI message with code:\n```javascript\nconsole.log("Hello, World!");\n```', sender: 'AI Bot' },
        { id: 2, text: 'This is a user message.', sender: 'User' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevents new line on Enter without Shift
            sendMessage();
        }
    };

    const chatContainerRef = useRef(null);

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const sendMessage = async () => {
        if (newMessage.trim() === '') return;

        setLoading(true)

        const userMessage = {
            id: messages.length + 1,
            text: newMessage,
            sender: 'User',
        };


        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setNewMessage('');

        const response = await generateContent(userMessage.text)

        const aiResponse = {
            id: updatedMessages.length + 1,
            text: response,
            sender: 'AI Bot',
        };

        setMessages([...updatedMessages, aiResponse]);

        setLoading(false)

        // // Simulate AI response (you can replace this with actual API call)
        // setTimeout(() => {
        //     const aiResponse = {
        //         id: updatedMessages.length + 1,
        //         text: code,
        //         sender: 'AI Bot',
        //     };
        //     setMessages([...updatedMessages, aiResponse]);
        // }, 500);
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const components = {
        code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'plaintext'; // Default to 'plaintext' if no language is detected
            return !inline && match ? (
                <div className="code-container">
                    <SyntaxHighlighter
                        style={theme}
                        language={language}
                        PreTag="div"
                        children={String(children).replace(/\n$/, '')}
                        {...props}
                    />
                    <div className="code-footer flex justify-between">
                        <span className="language">{language}</span>
                        <button className="copy-button" onClick={() => copyToClipboard(children)}>
                            Copy
                        </button>
                    </div>
                </div>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
    };

    return (
        <div className={`flex flex-1 asidePanel  border-2 border-red-700 flex-col ${AiTab ? "flex" : "hidden"}`}>
            <header className="text-white py-4 text-center">
                <div >AI Chatbot</div>
                <button  onClick={() => setAiTab(false)} className='switchRoom'>
                <svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M981.4 502.3c-9.1 0-18.3-2.9-26-8.9L539 171.7c-15.3-11.8-36.7-11.8-52 0L70.7 493.4c-18.6 14.4-45.4 10.9-59.7-7.7-14.4-18.6-11-45.4 7.7-59.7L435 104.3c46-35.5 110.2-35.5 156.1 0L1007.5 426c18.6 14.4 22 41.1 7.7 59.7-8.5 10.9-21.1 16.6-33.8 16.6z" fill="#5F6379"></path><path d="M810.4 981.3H215.7c-70.8 0-128.4-57.6-128.4-128.4V534.2c0-23.5 19.1-42.6 42.6-42.6s42.6 19.1 42.6 42.6v318.7c0 23.8 19.4 43.2 43.2 43.2h594.8c23.8 0 43.2-19.4 43.2-43.2V534.2c0-23.5 19.1-42.6 42.6-42.6s42.6 19.1 42.6 42.6v318.7c-0.1 70.8-57.7 128.4-128.5 128.4z" fill="#5850c0"></path></g></svg>
                    </button>
            </header>

            <div ref={chatContainerRef} className="messageArea overflow-y-scroll flex-1 p-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex justify-${message.sender === 'AI Bot' ? 'start' : 'end'} mb-4`}
                    >
                        <div
                            className={`${message.sender === 'AI Bot' ? 'botText' : 'userText'
                                } p-3 rounded-lg max-w-md`}
                        >
                            <ReactMarkdown components={components}>{message.text}</ReactMarkdown>
                            <p className="text-xs text-gray-500 mt-1 break-all truncate">{message.sender}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="msg-box1 p-4 flex items-center">
                <textarea
                    type="text"
                    placeholder="Type your message..."
                    onKeyUp={handleKeyPress}
                    className="ip-msg1"
                    value={newMessage}
                    onChange={handleInputChange}
                />
                {!loading && <button
                    onClick={sendMessage}
                    className="botbtn"
                >
                    <svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M768 810.7c-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7c94.1 0 170.7-76.6 170.7-170.7 0-89.6-70.1-164.3-159.5-170.1L754 383l-10.7-22.7c-42.2-89.3-133-147-231.3-147s-189.1 57.7-231.3 147L270 383l-25.1 1.6c-89.5 5.8-159.5 80.5-159.5 170.1 0 94.1 76.6 170.7 170.7 170.7 23.6 0 42.7 19.1 42.7 42.7s-19.1 42.7-42.7 42.7c-141.2 0-256-114.8-256-256 0-126.1 92.5-232.5 214.7-252.4C274.8 195.7 388.9 128 512 128s237.2 67.7 297.3 174.2C931.5 322.1 1024 428.6 1024 554.7c0 141.1-114.8 256-256 256z" fill="#5850c0"></path><path d="M640 789.3c-10.9 0-21.8-4.2-30.2-12.5L512 679l-97.8 97.8c-16.6 16.7-43.7 16.7-60.3 0-16.7-16.7-16.7-43.7 0-60.3l128-128c16.6-16.7 43.7-16.7 60.3 0l128 128c16.7 16.7 16.7 43.7 0 60.3-8.4 8.4-19.3 12.5-30.2 12.5z" fill="#5F6379"></path><path d="M512 960c-23.6 0-42.7-19.1-42.7-42.7V618.7c0-23.6 19.1-42.7 42.7-42.7s42.7 19.1 42.7 42.7v298.7c0 23.5-19.1 42.6-42.7 42.6z" fill="#5F6379"></path></g></svg>
                </button>}

                {loading && <span className="loader"></span>
                }
            </div>

        </div>
    );
};

export default Ai;
