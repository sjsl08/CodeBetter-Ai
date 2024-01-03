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

    const { getSocket, input,isAuthenticated,jsCode,pyCode,handleCode } = useContext(AppContext)


    
    const [codeResHistory, setCodeResHistory] = useState([]); // Track previous codeRes outputs





    const [file, setFile] = useState("js")
    const [AiTab, setAiTab] = useState(true)

    const outDiv = useRef(null)

    const [response, setResponse] = useState('');
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

    // useEffect(() => {
    //     if (getSocket()) {

           

    //     }

    //     // return () => {
    //     //   socket.disconnect();
    //     // };
    // }, []);


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

    const handleAiTab = (value) => {
        if(sessionStorage.getItem("username") == sessionStorage.getItem("roomId")) return
        setAiTab(value)
    }

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
                language: file == "js" ? "javascript" : "python",
                code: file === "js" ? [jsCode] : [pyCode],
            });
            console.log(codeRes.data);
            setOutput(codeRes.data);
            setCodeResHistory(prevHistory => [...prevHistory, codeRes.data]); // Save previous codeRes outputs
        } catch (error) {
            console.error('Error running code:', error.response.data);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

   

    return (
        <main className="flex relative  font-sans w-screen vsDark text-gray-800">
            {/* <header className="flex bg-purple-100 text-white">
                <Nav />
            </header> */}
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
                                <button onClick={run}>Run</button>
                            </div>
                        </div>
                        {file === "js" && <>
                            <Editor
                                height={'92vh'}
                                width={'70vw'}
                                onChange={(value) => handleCode("js", value)}
                                theme="vs-dark"
                                value={jsCode}
                                defaultValue='//javascript'
                                defaultLanguage="javascript"
                            />
                        </>
                        }
                        {file === "py" && <>
                            <Editor
                                height={'92vh'}
                                width={'70vw'}
                                onChange={(value) => handleCode("py", value)}
                                theme="vs-dark"
                                value={pyCode}
                                defaultValue='#python'
                                defaultLanguage="python"
                            />
                        </>
                        }
                    </div>

                        
                        <Ai code={response} setAiTab={handleAiTab} AiTab={AiTab} />
                        
                        <ChatBox setAiTab={handleAiTab}  AiTab={AiTab}/>
                    

                </div>
                {terminal &&
                    <div className='absolute z-40 border-2 border-green-400 w-[95vw] bg-gray-950 bottom-0 h-96 overflow-y-scroll'>
                        {codeResHistory.map((prevCodeRes, index) => (
                            <div key={index} className="p-4 bg-gray-900 rounded-lg mb-2">
                                <div className="text-lg text-white font-mono">
                                    Output : {prevCodeRes}
                                </div>
                            </div>
                        ))}


                    </div>}

            </div>

        </main>
    );
};

export default Dashboard;
