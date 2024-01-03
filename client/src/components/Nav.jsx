import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AppContext from '../utils/AppContext';

const Nav = () => {

  const {logout} = useContext(AppContext)
  return (
    <nav className="bg-gray-900 h-full p-4 ">
      <div className=" flex flex-col  items-center">
        {/* CodeBetter Logo or brand */}
        <div className="flex flex-col items-center space-x-2">
          <div className="text-white text-2xl font-extrabold">CodeBetter</div>
          <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-transparent bg-clip-text">Ai Within</div>
        </div>

        <button onClick={()=>{logout()}}>logout</button>

      </div>
    </nav>
  );
}

export default Nav;
