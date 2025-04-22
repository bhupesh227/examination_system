
import  { ReactNode } from 'react'
import {  requireUser } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const AdminLayout = async({children}:{children:ReactNode}) => {
  const user = await requireUser();
    const isStudent = user.role === "student";
    if (!isStudent) {
        redirect("/");
    }
  return (
        <>
            {children}
        </>
  )
}

export default AdminLayout;