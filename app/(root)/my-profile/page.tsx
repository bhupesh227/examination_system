import Profile from '@/components/Profile';
import { getTotalNoOfAdminExams } from '@/lib/actions/admin.action';
import { requireUser } from '@/lib/actions/auth.action'
import { getCreatedExamsByUserId } from '@/lib/actions/exam.action';
import { getTotalExamsGivenByStudent } from '@/lib/actions/general.action';
import React from 'react'

const page = async() => {
    const user = await requireUser();
    const totalExamsGiven = await getTotalExamsGivenByStudent({ userId: user.id });
    const teacherExamsCreated = await getCreatedExamsByUserId(user.id);
    const adminTotalExams = await getTotalNoOfAdminExams();
  return (
    <Profile user={user} totalExamsGiven={totalExamsGiven} teacherExamsCreated={teacherExamsCreated?.length} adminTotalExams={adminTotalExams}/>
  )
}

export default page