// AppContext.js
import { createContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import io from 'socket.io-client';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const socketRef = useRef(null);

    useEffect(() => {
        if (isAuthenticated && !socketRef.current) {
            socketRef.current = io('http://localhost:5000');

            socketRef.current.on('newMsgToClient', (newMessage) => {
                console.log(newMessage);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        }

        const socket = socketRef.current;

        return () => {
            if (!isAuthenticated && socket) {
                socket.disconnect();
                socketRef.current = null;
            }
        };
    }, [isAuthenticated]);

    const navigate = useNavigate();
    const location = useLocation();

    const login = () => {
        // Perform login logic
        // After successful login:
        setIsAuthenticated(true);
        navigate('/dashboard'); // Redirect to dashboard or desired route
    };

    const logout = () => {
        // Perform logout logic
        // After logout:
        setIsAuthenticated(false);
        navigate('/login'); // Redirect to login or desired route
    };

    const getSocket = () => {
        return socketRef.current;
    };

    return (
        <AppContext.Provider value={{ messages, getSocket, navigate, location, login, logout }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
