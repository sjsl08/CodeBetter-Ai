import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import axios from "axios"
import AppContext from '../utils/AppContext';

const Nav = () => {
  const { logout } = useContext(AppContext);
  const [string, setString] = useState("");
  let timerId = null;

  const debouncedSearch = (value) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      findUser(value);
    }, 1000);
  };

  const findUser = async (value) => {
    try {
      const res = await axios.get(`http://localhost:5000/user/search/${value}`);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setString(value);
    debouncedSearch(value);
  };

  return (
    <nav className="bg-blue-950">
      <button onClick={() => logout()}>SIGNOUT</button>
    </nav>
  );
};

export default Nav;
