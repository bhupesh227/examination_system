import React from 'react'
import EditExamForm from '@/components/EditExamForm';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getExamById } from '@/lib/actions/exam.action';
import { notFound, redirect } from 'next/navigation';



const page = async({params}:RouteParams) => {
  const { id } = await params;
  const [exam, currentUser] = await Promise.all([
    getExamById(id),
    getCurrentUser(),
  ]);

  if (!exam || !currentUser) notFound();

  const isAuthorized =
    currentUser.role === 'admin' ||
    (currentUser.role === 'teacher' && currentUser.id === exam.userId);
  
  if (!isAuthorized) redirect('/');
  return (
    <EditExamForm examData={{...exam , CurrentRole:currentUser.role}}/>
  )
}

export default page