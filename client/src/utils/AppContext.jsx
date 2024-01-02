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
                    console.log(`Received data from ${sessionStorage.getItem("roomId")}:`, data, sessionStorage.getItem("username"));
                    setMessages((prevMessages) => [...prevMessages, data]);

                    // Handle the received data here (e.g., update state)
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
        localStorage.clear()
        sessionStorage.clear()
        setIsAuthenticated(false);
        navigate('/'); // Redirect to login or desired route
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
            console.error('Error generating content:', error.response.data.error);
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
        <AppContext.Provider value={{ messages, getSocket, navigate, location, login, logout, signUp, isAuthenticated,generateContent }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
