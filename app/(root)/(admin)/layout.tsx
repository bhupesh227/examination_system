
import  { ReactNode } from 'react'
import {  requireUser } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import AdminSidebarContainer from '@/components/admin/AdminSidebarContainer';

const AdminLayout = async({children}:{children:ReactNode}) => {
  const user = await requireUser();
    const isAdmin = user.role === "admin";
    if (!isAdmin) {
        redirect("/");
    }
  return (
        <>
            <main className='flex min-h-screen w-full flex-col'>
              <AdminSidebarContainer username={user.username} email={user.email} />
              <div className='flex w-full flex-1 flex-col bg-light-300 p-1 xs:p-10 '>
                  {children}
              </div>
          </main>
        </>
  )
}

export default AdminLayout;