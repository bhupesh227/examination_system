import CreateExam from '@/components/CreateExam'
import { getCurrentUser } from '@/lib/actions/auth.action';
import React from 'react'

const page = async() => {
  const user = await getCurrentUser();
  return (
    <div className='flex flex-col items-center justify-center mt-5'>
        <CreateExam type='teacher' {...user}/>
    </div>
  )
}

export default page