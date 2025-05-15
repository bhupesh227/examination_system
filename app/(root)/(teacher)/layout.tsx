
import  { ReactNode } from 'react'
import {  requireUser } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import SidebarContainer from '@/components/teacher/SidebarContainer';




const TeacherLayout = async({children}:{children:ReactNode}) => {
  const user = await requireUser();
    const isTeacher = user.role === "teacher";
    if (!isTeacher) {
        redirect("/");
    }
  return (
        <>
            <main className='flex min-h-screen w-full flex-col'>
              <SidebarContainer username={user.username} email={user.email} />
              <div className='h-[1px] w-full bg-gray-600' />
              <div className='flex w-full flex-1 flex-col bg-light-300 p-1 xs:p-10 '>
                  {children}
              </div>
          </main>
        </>
        
       
     
  )
}

export default TeacherLayout