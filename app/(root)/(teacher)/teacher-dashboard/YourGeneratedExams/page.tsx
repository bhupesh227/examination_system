import EditExamCard from '@/components/EditExamCard';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getCreatedExamsByUserId } from '@/lib/actions/exam.action';
import React from 'react'
import ClientExamCard from '@/components/ClientExamCard';
import AllExamsCardList from '@/components/admin/AllExamsCardList';

const page = async() => {
    const user = await getCurrentUser();
    const [createdExam] = await Promise.all([
        getCreatedExamsByUserId(user?.id || '')
    ]);
    const hasPastCreatedExams = (createdExam?.length ?? 0) > 0;

    const renderedExamCards = await Promise.all(
        (createdExam || []).map(async (exam) => {
          const ExamCard = await (
            <EditExamCard
                key={exam.id}
                examId={exam.id}
                role={exam.role}
                title={exam.title}
                description={exam.description}
                duration={exam.duration}
                totalMarks={exam.totalMarks}
                passingMarks={exam.passingMarks}
                questions={exam.questions}
                createdAt={exam.createdAt}
            />
          );
          
          return (
            
            <ClientExamCard
              key={exam.id}
              interview={exam}
              userId={user?.id}
              ExamCard={ExamCard}
            />
          );
        })
    );
  return (
    <>
      <h2 className='mb-5 flex items-center justify-center'>Your Created Exams {createdExam && createdExam.length > 0 && 
          <span className="text-primary-200">({createdExam.length})</span>
        }</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-between self-center gap-6 mb-8'>
        {hasPastCreatedExams?(
          <AllExamsCardList renderedCards={renderedExamCards} />
              
        ):(
          <p className='ml-3 text-amber-200'>You haven&apos;t created any Exam yet</p>
        )}
      </div>
    </>
  )
}

export default page