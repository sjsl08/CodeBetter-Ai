import React, { useState, useContext } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppContext from "../utils/AppContext"
import { Navigate } from 'react-router-dom';


const Signup = () => {



  const { signUp, isAuthenticated } = useContext(AppContext)


  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  if (isAuthenticated) {
    return <Navigate to="/dashboard"  replace={true} />;
  }


  const springProps = {
    type: 'spring',
    damping: 10,
    stiffness: 100,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here (e.g., send form data to a server)
    console.log(formData); // For demonstration purposes; replace with actual logic


    signUp(formData)

  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">


      <motion.div initial={{ opacity: 0, x: 500 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...springProps, duration: 0.5 }} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-white text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="p-3 rounded-lg border border-white bg-transparent focus:outline-none focus:border-blue-500 text-white placeholder-white"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-3 rounded-lg border border-white bg-transparent focus:outline-none focus:border-blue-500 text-white placeholder-white"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="p-3 rounded-lg border border-white bg-transparent focus:outline-none focus:border-blue-500 text-white placeholder-white"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="p-3 rounded-lg border border-white bg-transparent focus:outline-none focus:border-blue-500 text-white placeholder-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Sign Up
          </button>
          <Link to="/" className="text-gray-200 block text-center mt-4">
            LOGIN
          </Link>
        </form>
      </motion.div>
      <div className="ml-8">
        {/* <TypeAnimation
          sequence={[
            'We produce food for Mice',
            1000,
            'We produce food for Hamsters',
            1000,
            'We produce food for Guinea Pigs',
            1000,
            'We produce food for Chinchillas',
            1000
          ]}
          wrapper="span"
          speed={50}
          style={{ fontSize: '2em', display: 'inline-block', color: 'white' }}
          repeat={Infinity}
        /> */}
      </div>

    </div>
  );
};

export default Signup;
