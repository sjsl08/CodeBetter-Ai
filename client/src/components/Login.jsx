import React, { useState ,useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppContext from "../utils/AppContext"
import { Navigate } from 'react-router-dom';


const Login = () => {

  const { login,isAuthenticated } = useContext(AppContext)


  const [formData, setFormData] = useState({
    email: '',
    password: '',
    roomId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }



  const handleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    login(formData)
  };

  const springProps = {
    type: 'spring',
    damping: 10,
    stiffness: 100,
  };



  return (
    <div

      className="flex flex-col justify-evenly items-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
    >
      <motion.div initial={{ opacity: 0, x: -500 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...springProps, duration: 0.5 }} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-10 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="flex flex-col">
            <label htmlFor="username" className="text-gray-200">
              Email
            </label>
            <input
              type="email"
              id="email"
              name='email'
              onChange={handleChange}
              value={formData.username}
              placeholder="Enter your email"
              className="p-3 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-gray-200 placeholder-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-200">
              Password
            </label>
            <input
              type="password"
              name='password'
              id="password"
              onChange={handleChange}
              value={formData.password}
              placeholder="Enter your password"
              className="p-3 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-gray-200 placeholder-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="room" className="text-gray-200">
              Room
            </label>
            <input
              type="text"
              id="room"
              name="roomId"
              onChange={handleChange}
              value={formData.roomId}
              placeholder="Enter Room-Id"
              className="p-3 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-gray-200 placeholder-gray-300"
            />
          </div>
          <button
            onClick={(e) => handleLogin(e)}
            type="submit"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
        <Link to="/signup" className="text-gray-200 block text-center mt-4">
          SIGNUP
        </Link>
      </motion.div>
    </div>
  );
};

export default Login;
