import React from 'react';
import { Link, redirect } from 'react-router-dom';

const Login = () => {


  return (
    <div className="flex justify-center items-center h-screen ">
      <div className=" bg-opacity-20 backdrop-filter backdrop-blur-lg p-10 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Login</h2>
        <form className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-gray-200">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="p-3 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-gray-200 placeholder-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="p-3 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-gray-200 placeholder-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-200">
              Room
            </label>
            <input
              type="room"
              id="room"
              placeholder="Enter Room-Id"
              className="p-3 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-gray-200 placeholder-gray-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
      </div>
      <Link to={"/signup"}>
      SIGNUP
      </Link>
    </div>
  );
};

export default Login;
