import { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import Nav from './Nav';
import ChatBox from './Chat/Chatbox';
import Scene from './R3F/Scene';
import { Navigate } from 'react-router-dom';

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-python';
import AppContext from '../utils/AppContext';
import Ai from './Ai/Ai';




const Dashboard = () => {

    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    }

    const showValue = () => {
        alert(editorRef.current.getValue());
    }

    const { getSocket, isAuthenticated } = useContext(AppContext)


    const [file, setFile] = useState("js")

    const outDiv = useRef(null)

    const [response, setResponse] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const [htmlOut, setHtmlOut] = useState("")

    const [terminal, setTerminal] = useState(false)

    const handleKeyPress = (event) => {
        if (event.ctrlKey && event.key === '`') {
            // Perform your desired action here when Ctrl + ` is pressed
            console.log('Ctrl + ` pressed');
            setTerminal(!terminal)
            // Add your functionality here
        }
    };

    useEffect(() => {
        if (getSocket()) {

            getSocket().on('response', (generatedResponse) => {
                // generatedResponse = generatedResponse.replace(/"/g, "'");
                // const pattern = /```javascript|```/g;
                // generatedResponse = generatedResponse.replace(pattern, '');

                // setHtmlOut((prev) => [...prev, Prism.highlight(generatedResponse, Prism.languages.javascript, 'javascript')])

                // setResponse((prev) => [...prev, generatedResponse]);
                // console.log(response);
            });

        }





        // return () => {
        //   socket.disconnect();
        // };
    }, []);


    useEffect(() => {
        if (outDiv.current) {
            outDiv.current.innerHTML = htmlOut;
        }
    }, [htmlOut]);
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [terminal]);



    const handleInput = (e) => {
        setInput(e.target.value);
    };

    const generateContent = async () => {
        try {
            const response = await axios.post('http://localhost:5000/generate', { input, roomId: sessionStorage.getItem("roomId") ? sessionStorage.getItem("roomId") : sessionStorage.getItem("username") });
            // console.log('Generated content:', response.data);
            // response.data = response.data.replace(/"/g, "'");
            // const pattern = /```javascript|```/g;
            // response.data = response.data.replace(pattern, '');
            // setHtmlOut(Prism.highlight(response.data, Prism.languages.javascript, 'javascript'))

            setResponse(response.data)
            // setHtmlOut((prev) => [...prev, Prism.highlight(generatedResponse, Prism.languages.javascript, 'javascript')])
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


    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    const grid = [50, 50]; // Adjust the values based on your snapping preference


    return (
        <main className="flex relative  font-sans w-screen text-gray-800">
            <header className="flex bg-purple-100 text-white">
                <Nav />
            </header>
            <div className="flex flex-col">
                <div className='flex'>
                    <div className='flex-1'>
                        <div className='flex justify-between'>
                            <div>
                                <button onClick={() => { setFile("js") }} className={`bg-gray-400 px-5 ${file === 'js' ? 'border-b-2' : 'border-r-2'}`}
                                >JS</button>
                                <button onClick={() => { setFile("py") }} className={`bg-gray-400 px-5 ${file === 'py' ? 'border-b-2' : 'border-r-2'}`}
                                >PY</button>
                            </div>
                            <div>
                                <button>Run</button>
                            </div>
                        </div>
                        {file === "js" && <>
                            <Editor
                                height={'92vh'}
                                width={'70vw'}
                                onChange={(value) => setInput(value)}
                                theme="vs-dark"
                                defaultValue='//javascript'
                                defaultLanguage="javascript"
                            />
                        </>
                        }
                        {file === "py" && <>
                            <Editor
                                height={'92vh'}
                                width={'70vw'}
                                onChange={(value) => setInput(value)}
                                theme="vs-dark"
                                defaultValue='#python'
                                defaultLanguage="python"
                            />
                        </>
                        }
                    </div>

                    <Ai code={response} />
                    {/* <ChatBox /> */}


                </div>
                {terminal && <div className='absolute border-2 border-green-400 w-[95vw] bg-gray-950 bottom-0 h-96'>

                    <div className="flex flex-col border-2 border-black">

                        <div className='border-2  h-2/4 overflow-y-scroll break-all border-blue-950'>

                            <pre ref={outDiv}>
                            </pre>

                            <textarea
                                type="text"
                                onChange={handleInput}
                                className="bg-gray-200 py-3 rounded-lg flex-1 ml-4 resize-none"
                                placeholder="Enter input here"
                            />
                        </div>
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

                </div>}

            </div>

        </main>
    );
};

export default Dashboard;
