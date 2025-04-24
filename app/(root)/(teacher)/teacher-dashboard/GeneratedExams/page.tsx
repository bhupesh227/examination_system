import ExamCard from '@/components/ExamCard';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getCreatedExamsByUserId } from '@/lib/actions/exam.action';
import React from 'react'

const page = async() => {
    const user = await getCurrentUser();
    const [createdExam] = await Promise.all([
        getCreatedExamsByUserId(user?.id || '')
    ]);
    const hasPastCreatedExams = (createdExam?.length ?? 0) > 0;
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 justify-between self-center gap-6 mb-8'>
        {hasPastCreatedExams?(
                createdExam?.map((exam)=>(
                  <ExamCard 
                    key={exam.id}
                    userId={user?.id || ''}
                    examId={exam.id}
                    title={exam.title}
                    description={exam.description}
                    duration={exam.duration}
                    totalMarks={exam.totalMarks}
                    passingMarks={exam.passingMarks}
                    questions={exam.questions}
                    createdAt={exam.createdAt}
                    role={exam.role}
                  />
                ))
              ):(
                <p>You haven&apos;t created any Exam yet</p>
              )}
    </div>
  )
}

export default page