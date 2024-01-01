import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Editor from '@monaco-editor/react';
import Nav from './Nav';
import ChatBox from './Chat/Chatbox';
import Scene from './R3F/Scene';

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-python';


const socket = io('http://localhost:665');

const Dashboard = () => {



    const outDiv = useRef(null)

    const [response, setResponse] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const [htmlOut, setHtmlOut] = useState("")

    useEffect(() => {
        socket.on('response', (generatedResponse) => {
            generatedResponse = generatedResponse.replace(/"/g, "'");
            setHtmlOut((prev) => [...prev, Prism.highlight(generatedResponse, Prism.languages.javascript, 'javascript')])

            setResponse((prev) => [...prev, generatedResponse]);
            console.log(response);
        });


        // return () => {
        //   socket.disconnect();
        // };
    }, []);


    useEffect(() => {
        if (outDiv.current) {
            outDiv.current.innerHTML = htmlOut;
        }
    }, [htmlOut]);

    const handleInput = (e) => {
        setInput(e.target.value);
    };

    const generateContent = async () => {
        try {
            const response = await axios.post('http://localhost:5000/generate', { input: input });
            console.log('Generated content:', response.data.generatedContent);
        } catch (error) {
            console.error('Error generating content:', error.response.data.error);
        }
    };

    const run = async () => {
        try {
            const codeRes = await axios.post('http://localhost:5000/run-code', {
                language: 'javascript',
                code: [input],
            });
            console.log(codeRes.data);
            setOutput(codeRes.data);
        } catch (error) {
            console.error('Error running code:', error.response.data.error);
        }
    };


    return (
        <main className="flex h-screen font-sans bg-gray-100 text-gray-800">
            <header className="w-1/6 bg-purple-700 text-white">
                <Nav />
            </header>
            <div className="w-5/6 flex flex-col">
                <div className="flex justify-between p-4">
                    <Editor
                        height={'50vh'}
                        width={'50vw'}
                        onChange={(value) => setInput(value)}
                        theme="vs-dark"
                        defaultLanguage="javascript"
                    />
                    <textarea
                        type="text"
                        onChange={handleInput}
                        className="bg-gray-200 py-3 rounded-lg flex-1 ml-4 resize-none"
                        placeholder="Enter input here"
                    />
                </div>
                <div className="flex justify-between p-4">
                    <button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out"
                        onClick={generateContent}
                    >
                        Generate
                    </button>
                    <button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out"
                        onClick={run}
                    >
                        RUN
                    </button>
                </div>
                {output && (
                    <div className="p-4 bg-gray-200 rounded-lg">
                        <div className="text-lg">Output: {output}</div>
                    </div>
                )}

                <Scene />
                <pre ref={outDiv}>
                </pre>
                <div className="mt-auto">
                    <ChatBox response={htmlOut} />
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
