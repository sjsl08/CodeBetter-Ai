// AppContext.js
import { createContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import io from 'socket.io-client';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const socketRef = useRef(null);
    const [roomId,setRoomID] = useState("")

    const [jsCode, setJsCode] = useState('//javascript');
    const [pyCode, setPyCode] = useState('#python');
    const [input, setInput] = useState('');
    const [pplInRoom,setPplInRoom] = useState(0)

    const handleCode = (type, value) => {
        setInput(value)
        if (type === "js") {
            setJsCode(value)
        } else {
            setPyCode(value)
        }

        const roomId = sessionStorage.getItem('roomId') ? sessionStorage.getItem('roomId') : sessionStorage.getItem('username');

        // Emit the code change event to the room
        getSocket().emit('codeChange', {
            type,
            value,
            roomId,
            user: sessionStorage.getItem("username")
        });
    }

    useEffect(() => {
        if (isAuthenticated && !socketRef.current) {
            socketRef.current = io('http://localhost:5000');

            if (sessionStorage.getItem("roomId")) {
                socketRef.current.on('newMsgToClient', (newMessage) => {
                    console.log(newMessage);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                });

                socketRef.current.on('connect', () => {
                    socketRef.current.emit('joinRoom', sessionStorage.getItem("roomId")); // Replace 'testRoom' with your room name
                });

                // Listen for events within the room
                socketRef.current.on('testRoomEvent', (data) => {
                    console.log(data);
                    console.log(`Received data from ${sessionStorage.getItem("roomId")}:`, data, sessionStorage.getItem("username"));
                    setPplInRoom(data.ppl)
                    setMessages((prevMessages) => [...prevMessages, data]);

                    // Handle the received data here (e.g., update state)
                });

                getSocket().on('codeChanged', ({ type, value, user }) => {
                    // Update the state based on the type (js or py)
                    console.log(user);
                    if (type === 'js') {
                        setJsCode(value);
                    } else {
                        setPyCode(value);
                    }
                });
            }

            getPrevPrompts()
        }

        const socket = socketRef.current;

        return () => {
            if (!isAuthenticated && socket) {
                socket.disconnect();
                socketRef.current = null;
            }
        };
    }, [isAuthenticated]);

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem("token") ? true : false)
    }, [])

    const navigate = useNavigate();
    const location = useLocation();

    const login = async (UserDetails) => {
        try {
            const response = await axios.post('http://localhost:5000/user/login', UserDetails);
            setIsAuthenticated(true);
            localStorage.setItem("token", response.data.token)
            sessionStorage.setItem("username", response.data.user)
            sessionStorage.setItem("roomId", UserDetails.roomId ? UserDetails.roomId : response.data.user)
            setRoomID(sessionStorage.getItem("roomId"))
            navigate('/dashboard', { replace: true });
        } catch (error) {
            console.error(error);
        }
    };

    const logout = () => {
        console.log("here");
        localStorage.clear()
        sessionStorage.clear()
        setIsAuthenticated(false);
        navigate('/'); // 
    };

    const getSocket = () => {
        return socketRef.current;
    };



    const getPrevPrompts = async () => {
        try {
            const headers = { "Authorization": `Bearer ${localStorage.getItem("token")}` }

            const response = await axios.get(`http://localhost:5000/save-prompt/${roomId}`,{headers});
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }



    const generateContent = async (input) => {
        try {
            const response = await axios.post('http://localhost:5000/generate', { input, roomId: sessionStorage.getItem("roomId") ? sessionStorage.getItem("roomId") : sessionStorage.getItem("username") });
            console.log('Generated content:', response.data);
            return response.data

            // response.data = response.data.replace(/"/g, "'");
            // const pattern = /```javascript|```/g;
            // response.data = response.data.replace(pattern, '');
            // setHtmlOut(Prism.highlight(response.data, Prism.languages.javascript, 'javascript'))

            // setHtmlOut((prev) => [...prev, Prism.highlight(generatedResponse, Prism.languages.javascript, 'javascript')])
        } catch (error) {
            console.error('Error generating content:', error.response.data);
            return error.response.data.msg
        }
    };

    // user functions

    const signUp = async (UserDetails) => {
        try {
            const response = await axios.post('http://localhost:5000/user/signup', UserDetails);
            // console.log('Generated content:', response.data.generatedContent);
        } catch (error) {
            console.error(error);
        }
    };

    //


    return (
        <AppContext.Provider value={{ messages, getSocket, navigate, location, login, logout, signUp, isAuthenticated,generateContent ,jsCode,pyCode,handleCode,input,pplInRoom}}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
