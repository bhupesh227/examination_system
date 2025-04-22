
import  { ReactNode } from 'react'
import {  requireUser } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const AdminLayout = async({children}:{children:ReactNode}) => {
  const user = await requireUser();
    const isAdmin = user.role === "admin";
    if (!isAdmin) {
        redirect("/");
    }
  return (
        <>
            {children}
        </>
        
       
     
  )
}

export default AdminLayout;