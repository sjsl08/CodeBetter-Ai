import React from 'react'
import BG from './BG'

const Layout = ({children}) => {
  
    
  return (
    <div className='h-screen'>
      <div className='bg-black flex justify-center'>HELLO</div>
      {children}
    </div>
  )
}

export default Layout
