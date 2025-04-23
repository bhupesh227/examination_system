import React from 'react'
import TeacherDashboard from '@/components/TeacherDashboard'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getCreatedExamsByUserId } from '@/lib/actions/exam.action';
const page = async() => {
  const user = await getCurrentUser();
  const [createdExam] = await Promise.all([
    getCreatedExamsByUserId(user?.id || '')
  ]);

  

  return (
    <div>
        <TeacherDashboard user={user} createdExam={createdExam || []}/>
    </div>
  )
}

export default page