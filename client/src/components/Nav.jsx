import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="bg-gray-900 h-full p-4 ">
      <div className=" flex flex-col  items-center">
        {/* CodeBetter Logo or brand */}
        <div className="flex flex-col items-center space-x-2">
          <div className="text-white text-2xl font-extrabold">CodeBetter</div>
          <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-transparent bg-clip-text">Ai Within</div>
        </div>

        {/* Navigation links */}
        {/* <div className="flex space-x-4">
          <NavLink to="/contact" className="text-white hover:text-gray-300 transition duration-300 px-2 py-1 rounded">Contact</NavLink>
        </div> */}
      </div>
    </nav>
  );
}

export default Nav;
