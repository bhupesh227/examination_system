
import  { ReactNode } from 'react'
import {  requireUser } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import StudentSidebarContainer from '@/components/student/StudentSidebarContainer';

const StudentLayout = async({children}:{children:ReactNode}) => {
  const user = await requireUser();
    const isStudent = user.role === "student";
    if (!isStudent) {
        redirect("/");
    }
  return (
        <>
          <main className='flex min-h-screen w-full flex-col'>
            <StudentSidebarContainer username={user.username} email={user.email} />
           
            <div className='h-[1px] w-full bg-gray-600' />
            <div className='flex w-full flex-1 flex-col bg-light-300 xs:p-10 '>
              {children}
            </div>
          </main>
            
        </>
  )
}

export default StudentLayout;