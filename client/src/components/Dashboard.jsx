import { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import Nav from './Nav';
import ChatBox from './Chat/Chatbox';
import Scene from './R3F/Scene';
import { Navigate } from 'react-router-dom';
import '../App.css'
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
        <main className="flex relative  mainContainer font-sans w-screen vsDark text-gray-800">
            {/* <header className="flex bg-purple-100 text-white">
                <Nav />
            </header> */}
            <div className="flex flex-col">
                <div className='flex'>
                    <div className='flex-1'>
                        <div className='flex justify-between'>
                            <div className='flex'>
                                <button id='btnJs' onClick={() => { setFile("js") }} className={`bg-gray-400 px-5 ${file === 'js' ? 'active' : 'diactive'}`}
                                >
                                    <span>

                                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17.1725 2.29872C16.4627 1.89953 15.5373 1.90132 14.8269 2.29872C11.2689 4.26227 7.71082 6.22641 4.15216 8.18906C3.45969 8.55335 2.99264 9.29698 3.00009 10.0688V21.9328C2.99509 22.7197 3.48622 23.4705 4.19655 23.8298C5.21871 24.3736 6.2118 24.9726 7.25244 25.4802C8.45451 26.0709 9.95843 26.2015 11.1752 25.5855C12.1629 25.075 12.6016 23.9395 12.6003 22.896C12.6083 18.9806 12.6016 15.0651 12.6034 11.1496C12.6269 10.9756 12.4962 10.7896 12.3064 10.7938C11.8517 10.7866 11.3964 10.7896 10.9417 10.7926C10.7699 10.7764 10.6022 10.9191 10.6152 11.0918C10.6091 14.982 10.6164 18.8734 10.6115 22.7642C10.6214 23.3024 10.2578 23.8196 9.73913 24.0014C8.5412 24.4213 5.12198 22.2012 5.12198 22.2012C4.9965 22.1431 4.91682 22.007 4.92912 21.8718C4.92912 17.9576 4.92973 14.0433 4.92912 10.1297C4.91187 9.97191 5.00912 9.8298 5.15402 9.76538C8.70033 7.8134 12.2448 5.85654 15.7911 3.90336C15.9143 3.82115 16.086 3.8214 16.2089 3.90396C19.7552 5.85654 23.3003 7.81161 26.8472 9.76368C26.9926 9.828 27.0857 9.9725 27.0709 10.1297C27.0703 14.0433 27.0721 17.9576 27.0697 21.8713C27.0802 22.0098 27.0086 22.144 26.8793 22.2048C23.3661 24.1462 19.8129 26.025 16.3315 28.0228C16.1796 28.1099 16.0075 28.2086 15.8373 28.1126C14.9218 27.6062 14.0174 27.0801 13.1049 26.5688C13.0057 26.5069 12.8794 26.4803 12.7759 26.5496C12.3668 26.7652 11.982 26.9398 11.5122 27.1258C10.8524 27.387 10.9578 27.4938 11.5529 27.8405C12.62 28.4444 13.6889 29.0459 14.756 29.6504C15.4585 30.0888 16.4024 30.12 17.1275 29.7149C20.6861 27.7538 24.2436 25.7904 27.8029 23.8293C28.5113 23.468 29.0049 22.7202 28.9999 21.9327V10.0688C29.0068 9.31264 28.5576 8.58227 27.886 8.21259C24.3156 6.23947 20.7435 4.27064 17.1725 2.29872Z" fill="#c8be4c"></path> <path d="M22.5419 11.2062C21.1452 10.459 19.4836 10.4192 17.9315 10.5169C16.8102 10.6277 15.6309 10.9371 14.814 11.7409C13.9761 12.5489 13.7937 13.8537 14.1917 14.9085C14.4769 15.6539 15.1948 16.1386 15.9372 16.395C16.8935 16.7326 17.8979 16.837 18.9026 16.9414C19.819 17.0366 20.7357 17.1319 21.6165 17.4042C21.9763 17.5234 22.3953 17.7058 22.5055 18.0973C22.6073 18.5609 22.4957 19.0998 22.1193 19.4219C20.9237 20.3682 17.5979 20.2232 16.4166 19.4784C15.939 19.1611 15.7332 18.5994 15.6495 18.0641C15.6402 17.8973 15.5059 17.7443 15.3248 17.757C14.8713 17.7516 14.4178 17.7528 13.9643 17.7564C13.8061 17.7431 13.6416 17.8557 13.6329 18.0172C13.5397 20.4689 15.7914 21.5377 17.9039 21.773C19.1108 21.888 20.3442 21.8814 21.5327 21.6224C22.4261 21.419 23.3219 21.0444 23.9369 20.3563C24.6953 19.52 24.8444 18.2749 24.5043 17.2332C24.2443 16.4559 23.5012 15.9573 22.7416 15.7008C21.7086 15.3466 20.4844 15.1562 19.5488 15.0671C18.1889 14.9376 16.5729 14.9905 16.188 14.0969C16.0345 13.629 16.1651 13.048 16.5951 12.7602C17.7328 11.9885 20.0483 12.091 21.2265 12.6675C21.7675 12.9384 22.081 13.4948 22.2104 14.0565C22.2344 14.2215 22.3454 14.3937 22.5364 14.3865C22.9868 14.3955 23.4372 14.3889 23.8875 14.3895C24.0422 14.4003 24.2116 14.313 24.2418 14.1546C24.2227 12.9806 23.6232 11.7788 22.5419 11.2062Z" fill="#c8be4c"></path> </g></svg>
                                    </span>
                               <span>
                                JavaScript
                               </span>
                                </button>
                              
                                <button id='btnJs' onClick={() => { setFile("py") }} className={`bg-gray-400 px-5 ${file === 'py' ? 'active' : 'diactive'}`}
                                >
                                    <span><svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clip-rule="evenodd" d="M13.0164 2C10.8193 2 9.03825 3.72453 9.03825 5.85185V8.51852H15.9235V9.25926H5.97814C3.78107 9.25926 2 10.9838 2 13.1111L2 18.8889C2 21.0162 3.78107 22.7407 5.97814 22.7407H8.27322V19.4815C8.27322 17.3542 10.0543 15.6296 12.2514 15.6296H19.5956C21.4547 15.6296 22.9617 14.1704 22.9617 12.3704V5.85185C22.9617 3.72453 21.1807 2 18.9836 2H13.0164ZM12.0984 6.74074C12.8589 6.74074 13.4754 6.14378 13.4754 5.40741C13.4754 4.67103 12.8589 4.07407 12.0984 4.07407C11.3378 4.07407 10.7213 4.67103 10.7213 5.40741C10.7213 6.14378 11.3378 6.74074 12.0984 6.74074Z" fill="url(#paint0_linear_87_8204)"></path> <path fillRule="evenodd" clipRule="evenodd" d="M18.9834 30C21.1805 30 22.9616 28.2755 22.9616 26.1482V23.4815L16.0763 23.4815L16.0763 22.7408L26.0217 22.7408C28.2188 22.7408 29.9998 21.0162 29.9998 18.8889V13.1111C29.9998 10.9838 28.2188 9.25928 26.0217 9.25928L23.7266 9.25928V12.5185C23.7266 14.6459 21.9455 16.3704 19.7485 16.3704L12.4042 16.3704C10.5451 16.3704 9.03809 17.8296 9.03809 19.6296L9.03809 26.1482C9.03809 28.2755 10.8192 30 13.0162 30H18.9834ZM19.9015 25.2593C19.1409 25.2593 18.5244 25.8562 18.5244 26.5926C18.5244 27.329 19.1409 27.9259 19.9015 27.9259C20.662 27.9259 21.2785 27.329 21.2785 26.5926C21.2785 25.8562 20.662 25.2593 19.9015 25.2593Z" fill="url(#paint1_linear_87_8204)"></path> <defs> <linearGradient id="paint0_linear_87_8204" x1="12.4809" y1="2" x2="12.4809" y2="22.7407" gradientUnits="userSpaceOnUse"> <stop stopColor="#327EBD"></stop> <stop offset="1" stopColor="#1565A7"></stop> </linearGradient> <linearGradient id="paint1_linear_87_8204" x1="19.519" y1="9.25928" x2="19.519" y2="30" gradientUnits="userSpaceOnUse"> <stop stopColor="#FFDA4B"></stop> <stop offset="1" stopColor="#F9C600"></stop> </linearGradient> </defs> </g></svg></span>
                                    <span>Python</span>
                                    </button>
                            </div>
                            <div className='playBtn'>
                                <button onClick={run}>
                                <svg width="20px" height="20px" viewBox="-3 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>play</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-419.000000, -571.000000)" fill="#52B255"> <path d="M440.415,583.554 L421.418,571.311 C420.291,570.704 419,570.767 419,572.946 L419,597.054 C419,599.046 420.385,599.36 421.418,598.689 L440.415,586.446 C441.197,585.647 441.197,584.353 440.415,583.554" id="play" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>
                                </button>
                            </div>
                        </div>
                        {file === "js" && <>
                            <Editor
                                height={'92vh'}
                                width={'calc(100vw - 560px'}
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
                                width={'calc(100vw - 560px'}
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
                    <div className='absolute z-40 border-2 border-green-400 terminal bg-gray-950 bottom-0 h-96 overflow-y-scroll'>
                        <div className='terminalH'><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M20.6 4H3.4A2.4 2.4 0 0 0 1 6.4v11.2A2.4 2.4 0 0 0 3.4 20h17.2a2.4 2.4 0 0 0 2.4-2.4V6.4A2.4 2.4 0 0 0 20.6 4Z" fill="#007AD1" fill-opacity=".16" stroke="#007AD1" stroke-width="1.5" stroke-miterlimit="10"></path><path d="m5 16 4-4-4-4" stroke="#007AD1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 16h8" stroke="#007AD1" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"></path></g></svg> <span>Terminal</span></div>
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
