
import React, { ReactNode } from 'react'


const layout = async({children}:{children:ReactNode}) => {
  
  return (
    <div className='login-bg'>
      <div className='auth-layout '>
        {children}
      </div>
    </div>
    
  )
}

export default layout