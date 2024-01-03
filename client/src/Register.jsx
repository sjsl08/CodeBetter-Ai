import React, { useContext, useEffect, useState } from 'react';
import './Register.css';
import AppContext from './utils/AppContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';


export const Register = () => {

  //sign up
  const [isSign, setSign] = useState(true)
  const { signUp, login, isAuthenticated } = useContext(AppContext)



  const [formDatas, setFormDatas] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChangesign = (e) => {
    const { name, value } = e.target;
    setFormDatas({
      ...formDatas,
      [name]: value,
    });
  };


  // if (isAuthenticated) {
  //   return <Navigate to="/dashboard"  replace={true} />;
  // }


  const springPropss = {
    type: 'spring',
    damping: 10,
    stiffness: 100,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle signup logic here (e.g., send form data to a server)
    console.log(formDatas); // For demonstration purposes; replace with actual logic

    try {

      await signUp(formDatas)
      setSign(true)
    } catch (e) {
      console.log(e);
    }

  };


  //fromcontrol


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
    try {

      login(formData)

    } catch (e) {
      console.log(e);
    }
    e.stopPropagation();
  };

  const springProps = {
    type: 'spring',
    damping: 10,
    stiffness: 100,
  };





  // //login effects
  useEffect(() => {
    function showTime() {
      var a_p = "";
      var today = new Date();
      var curr_hour = today.getHours();
      var curr_minute = today.getMinutes();
      var curr_second = today.getSeconds();
      if (curr_hour < 12) {
        a_p = " AM ";
      } else {
        a_p = " PM ";
      }
      if (curr_hour === 0) {
        curr_hour = 12;
      }
      if (curr_hour > 12) {
        curr_hour = curr_hour - 12;
      }
      curr_hour = checkTime(curr_hour);
      curr_minute = checkTime(curr_minute);
      curr_second = checkTime(curr_second);
      document.getElementById('login-time').innerHTML = curr_hour + ":" + curr_minute + "<span style='font-size:10px;'>" + a_p + "</span>";
    }

    function checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }

    setInterval(showTime, 500);

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var myDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var thisDay = date.getDay();
    thisDay = myDays[thisDay];
    var yy = date.getYear();
    var year = (yy < 1000) ? yy + 1900 : yy;

    document.getElementById('login-day').innerHTML = thisDay;
    document.getElementById('login-date').innerHTML = day;
    document.getElementById('login-month').innerHTML = months[month];
  }, []);


  //handle Signup

  const handleSignup = () => {
    setSign(false)
  }

  const handlesLogin = () => {
    setSign(true)
  }

  return (
    <div className='loginSection'>
      <div id="leftmenu">
        <div id="date_time">
          <div id="date" className="semi_arc e4 c_ease">
            <div className="semi_arc_2 e4_1">
              <div className="counterspin4"></div>
            </div>
            <div style={{ color: '#9933ff', fontSize: '40px', marginTop: '15px' }} id="login-date"></div>
            <div style={{ color: '#007AD1', fontSize: '25px', marginTop: '-65px' }} id="login-month"></div>
          </div>
          <div id="time" className="arc e1 c_ease">
            <div style={{ color: '#9933ff', fontSize: '18px', marginLeft: '0px', marginTop: '68px', textAlign: 'center' }} id="login-time"></div>
            <div style={{ color: '#007AD1', fontSize: '17px', marginTop: '-20px' }} id="login-day"></div>
          </div>
        </div>
      </div>
      <div id="rightmenu">
        <img className='mobius' src="../public/Mobius.svg" alt="mobius" />
        <div className="semi_arc e5 c_ease">
          <div className="semi_arc_3 e5_1">
            <div className="semi_arc_3 e5_2">
              <div className="semi_arc_3 e5_3">
                <div className="semi_arc_3 e5_4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="company-login-form">


        {
          isSign ? <form action="" method="" onSubmit={handleLogin}>
            <div id="company-logo">
              <h1 className='logoH1'><i> Login</i></h1>
            </div>
            <div id="login-fade-box">
              <input
                type="email"
                id="email"
                name='email'
                onChange={handleChange}
                value={formData.username}
                placeholder="Email Id" required />
              <input type="password"
                name='password'
                id="password"
                onChange={handleChange}
                value={formData.password}
                placeholder="Password" required />
              <input
                type="text"
                id="room"
                name="roomId"
                onChange={handleChange}
                value={formData.roomId}
                placeholder="Enter Room-Id"
                required />
              <button
                onClick={(e) => handleLogin(e)}
                type="submit"
                id="waitMe_ex_body">Log In</button>
              <div className='linkChange' onClick={handleSignup}>Sign Up</div>
            </div>
          </form> :


            <form action="" method="" onSubmit={handleSubmit}>
              <div id="company-logo">
                <h1 className='logoH1'><i>Sign Up</i></h1>
              </div>
              <div id="login-fade-box">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formDatas.username}
                  onChange={handleChangesign}
                  placeholder="Username"
                  required />
                <input
                  type="email"
                  id="email"
                  name='email'
                  onChange={handleChangesign}
                  value={formDatas.email}
                  placeholder="Email Id" required />
                <input type="password"
                  name='password'
                  id="password"
                  onChange={handleChangesign}
                  value={formDatas.password}
                  placeholder="Password" required />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formDatas.confirmPassword}
                  onChange={handleChangesign}
                  placeholder="Confirm Password"
                  required />

                <button
                  onClick={(e) => handleSubmit(e)}
                  type="submit"
                  id="waitMe_ex_body">Sign Up</button>
                <div className='linkChange' onClick={handlesLogin}>Log In</div>
              </div>
            </form>



        }

      </div>
      <div id="form-outer-circle">
        <div id="form-inner-circle"></div>
      </div>
    </div>
  );
};
