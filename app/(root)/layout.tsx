

import React, { ReactNode } from 'react'

const RootLayout = async({children}:{children:ReactNode}) => {
  
  return (
    <div className=''>
     
      {children}
      
    </div>
  )
}

export default RootLayout