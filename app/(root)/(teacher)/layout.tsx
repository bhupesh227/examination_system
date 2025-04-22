
import  { ReactNode } from 'react'
import {  requireUser } from '@/lib/actions/auth.action';

import { redirect } from 'next/navigation';




const TeacherLayout = async({children}:{children:ReactNode}) => {
  const user = await requireUser();
    const isTeacher = user.role === "teacher";
    if (!isTeacher) {
        redirect("/");
    }
  return (
        <>
            {children}
        </>
        
       
     
  )
}

export default TeacherLayout