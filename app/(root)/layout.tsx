
import React, { ReactNode } from 'react'
import {  requireUser } from '@/lib/actions/auth.action';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';




const RootLayout = async({children}:{children:ReactNode}) => {
  const user = await requireUser();
  return (
    <>
      <div className='root-layout min-h-screen home-bg'>
        <Navbar user={user}/>
        {children}
      </div>
      <Footer />
    </>
  )
}

export default RootLayout