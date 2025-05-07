import Profile from '@/components/Profile';
import { requireUser } from '@/lib/actions/auth.action'
import { getTotalExamsGivenByStudent } from '@/lib/actions/general.action';
import React from 'react'

const page = async() => {
    const user = await requireUser();
    const totalExamsGiven = await getTotalExamsGivenByStudent({ userId: user.id });
    console.log("Total Exams Given: ", totalExamsGiven);
    console.log("User: ", user.id);
  return (
    <Profile user={user} totalExamsGiven={totalExamsGiven} />
  )
}

export default page