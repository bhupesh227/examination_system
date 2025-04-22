
import React, { ReactNode } from 'react'
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';



const layout = async({children}:{children:ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  if(isUserAuthenticated) {
    redirect("/");
  }
  return (
    <div className='login-bg'>
      <Navbar user={{id:"", username:"", avatarURL:"",role:""}}/>
      <div className='auth-layout pt-15'>
        {children}
      </div>
      <Footer />
    </div>
    
  )
}

export default layout