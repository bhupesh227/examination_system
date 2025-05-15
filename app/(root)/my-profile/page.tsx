import Profile from '@/components/Profile';
import { getTotalNoOfAdminExams, getTotalNoOfTeacherExams } from '@/lib/actions/admin.action';
import { requireUser } from '@/lib/actions/auth.action'
import { getTotalExamsGivenByStudent } from '@/lib/actions/general.action';
import React from 'react'

const page = async() => {
    const user = await requireUser();
    const totalExamsGiven = await getTotalExamsGivenByStudent({ userId: user.id });
    const teacherExamsCreated = await getTotalNoOfTeacherExams();
    const adminTotalExams = await getTotalNoOfAdminExams();
  return (
    <Profile user={user} totalExamsGiven={totalExamsGiven} teacherExamsCreated={teacherExamsCreated} adminTotalExams={adminTotalExams}/>
  )
}

export default page