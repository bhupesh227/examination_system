
import React, { ReactNode } from 'react'
import {  requireUser } from '@/lib/actions/auth.action';
import Navbar from '@/components/Navbar';



const RootLayout = async({children}:{children:ReactNode}) => {
  const user = await requireUser();
  return (
    <div className='root-layout'>
      <Navbar user={user}/>
      {children}
      
    </div>
  )
}

export default RootLayout