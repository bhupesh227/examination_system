
import React, { ReactNode } from 'react'
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';


const layout = async({children}:{children:ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  if(isUserAuthenticated) {
    redirect("/");
  }
  return (
    <div className='login-bg'>
      <Navbar />
      <div className='auth-layout pt-15'>
        
        {children}
      </div>
    </div>
    
  )
}

export default layout