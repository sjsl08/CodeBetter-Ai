import React, { useState } from 'react';

const Signup = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here (e.g., send form data to a server)
    console.log(formData); // For demonstration purposes; replace with actual logic
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-semibold mb-6 text-gray-800 text-center">CodeBetter</h1>
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="p-3 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-gray-800 placeholder-gray-400"
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
              className="p-3 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-gray-800 placeholder-gray-400"
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
              className="p-3 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-gray-800 placeholder-gray-400"
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
              className="p-3 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-gray-800 placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
