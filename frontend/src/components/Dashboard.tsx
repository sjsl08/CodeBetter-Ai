import React, { useEffect, useState } from 'react'

import axios from 'axios'

import io from 'socket.io-client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';


import * as style from 'react-syntax-highlighter/dist/esm/styles/prism';

import Editor from "@monaco-editor/react"

import Nav from './Nav';


const socket = io('http://localhost:5000'); // Update with your server URL


const Dashboard = () => {



    const [response, setResponse] = useState("")

    useEffect(() => {

        console.log(socket);

        // Listen for text updates from the server
        socket.on('response', (generatedResponse) => {
            setResponse((prev) => {
                return [...prev, generatedResponse];
            });
            console.log(response);

        });

        // Clean up the socket connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);


    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')

    const handleInput = (e) => {
        const { value } = e.target
        setInput(value)
    }

    const generateContent = async () => {
        console.log(input);
        
        axios.post("http://localhost:5000/generate", { input: input })
            .then(response => {
                console.log("Generated content:", response.data.generatedContent);
                // Use the generated content as needed
            })
            .catch(error => {
                console.error("Error generating content:", error.response.data.error);
            });
    }


    const run = async () => {
        const codeRes = await axios.post("http://localhost:5000/run-code", { language: "javascript", code: [input] })
        console.log(codeRes.data);

        setOutput(codeRes.data)
        console.log(output);

    }

    return (
        <main className="flex   h-screen ">
            <header>
                <Nav />
            </header>
            <Editor  height={"50vh"} width={"50vw"} onChange={(e)=>{setInput(e)}} theme='vs-dark' defaultLanguage='javascript' />
            <textarea type="text" onChange={(e) => { handleInput(e) }} className='bg-neutral-300 py-3 rounded-xl' />
            <button className='bg-purple-300' onClick={() => { generateContent() }}>generate</button>
            <button className='bg-purple-300' onClick={() => { run() }}>RUN</button>

            <SyntaxHighlighter language="javascript" style={style.materialDark}>
                {input}
            </SyntaxHighlighter>
            {output && <div>

                Output:{output}
            </div>}


            {response}
            {/* </div> */}



            {/* </Typist> */}
        </main>
    )
}

export default Dashboard
