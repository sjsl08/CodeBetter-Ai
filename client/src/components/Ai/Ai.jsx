import React, { useState, useRef, useEffect, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import theme from 'react-syntax-highlighter/dist/esm/styles/prism/synthwave84';
import AppContext from '../../utils/AppContext';


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
        <div className={`flex flex-1  border-2 border-red-700 max-h-[95vh] flex-col ${AiTab ? "flex" : "hidden"}`}>
            <header className="bg-gray-900 text-white text-center">
                <button onClick={() => setAiTab(false)}>CodeBetter Ai</button>
            </header>

            <div ref={chatContainerRef} className="overflow-y-scroll flex-1 p-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex justify-${message.sender === 'AI Bot' ? 'start' : 'end'} mb-4`}
                    >
                        <div
                            className={`${message.sender === 'AI Bot' ? 'bg-blue-200' : 'bg-green-200'
                                } p-3 rounded-lg max-w-md`}
                        >
                            <ReactMarkdown components={components}>{message.text}</ReactMarkdown>
                            <p className="text-xs text-gray-500 mt-1 break-all truncate">{message.sender}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-200 p-4 flex items-center">
                <textarea
                    type="text"
                    placeholder="Type your message..."
                    onKeyUp={handleKeyPress}
                    className="flex-1 py-2 px-4 resize-none rounded-md border border-gray-300 focus:outline-none"
                    value={newMessage}
                    onChange={handleInputChange}
                />
                {!loading && <button
                    onClick={sendMessage}
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                    Send
                </button>}

                {loading && <span className="loader"></span>
                }
            </div>

        </div>
    );
};

export default Ai;
