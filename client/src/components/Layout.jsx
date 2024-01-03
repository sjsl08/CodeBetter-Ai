import React, {useContext} from 'react'
import AppContext from '../utils/AppContext'

const Layout = ({ children }) => {


  const {logout} = useContext(AppContext)

  return (
    <div className='h-screen'>
      <div className={`flex vsDark px-8 justify-between items-center space-x-2 border-b-2 border-purple-500 ${localStorage.getItem("token") ? "" : "hidden"}`} >
        <div className='flex items-center'>
          <div className="text-white text-2xl font-extrabold">CodeBetter</div>
          <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-transparent bg-clip-text">Ai Within</div>
        </div>
        <div>
          {/* Example styled sign-out button */}
          <button onClick={()=>{logout()}} className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-transparent bg-clip-text">
            Sign Out
          </button>

        </div>
      </div>
      {children}
    </div>
  )
}

export default Layout
