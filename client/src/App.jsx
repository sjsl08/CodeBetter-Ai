import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';
import "./App.css"
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom"
import Login from './components/Login';
import Signup from './components/Signup';
import Layout from './components/Layout';
import BG from './components/BG';
import Dashboard from './components/Dashboard';



const socket = io('http://localhost:5000'); // Update with your server URL

const App = () => {
  const [text, setText] = useState('');
  const [highlightedCode, setHighlightedCode] = useState('');

  useEffect(() => {
    // Listen for text updates from the server
    socket.on('text-update', (updatedText) => {
      setText(updatedText);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleTextChange = (e) => {
    const updatedText = e.target.value;
    setText(updatedText);

    // Send the updated text to the server
    socket.emit('text-update', updatedText);

    // Highlight the code
    highlightCode(updatedText);
  };

  const highlightCode = (code) => {
    // You can use a syntax highlighting library here
    setHighlightedCode(code);
  };

  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Router>
      {/* <BG /> */}

    </>
    // <div>
    //   <textarea
    //     value={text}
    //     onChange={handleTextChange}
    //     placeholder="Start typing..."
    //     rows={10}
    //     cols={50}
    //   />
    //   <div>
    //     <h3>Highlighted Code:</h3>
    //     <SyntaxHighlighter language="python" style={solarizedlight}>
    //       {highlightedCode}
    //     </SyntaxHighlighter>
    //   </div>
    // </div>
  );
};

export default App;
