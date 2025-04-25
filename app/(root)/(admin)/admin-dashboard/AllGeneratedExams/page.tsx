import EditExamCard from '@/components/EditExamCard';
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getLatestExam } from '@/lib/actions/general.action';
import ClientExamCard from '@/components/ClientExamCard';
import React from 'react'
import AllExamsCardList from '@/components/admin/AllExamsCardList';

const page = async() => {
    const user = await getCurrentUser();
    const [allExam] = await Promise.all([
        getLatestExam({ userId: user?.id || '' }),
    ]);
    const hasUpcomingExam = (allExam?.length ?? 0) > 0;

    const renderedExamCards = await Promise.all(
        (allExam || []).map(async (exam) => {
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
      <section className='flex flex-col gap-6 mt-8'>
        <h2>All Exam {allExam && allExam.length > 0 && 
          <span className="text-primary-200">({allExam.length})</span>
        }</h2>


        {hasUpcomingExam ? (
          <AllExamsCardList renderedCards={renderedExamCards} />
        ) : (
          <p>There are no exam available</p>
        )}
      </section>
    </>
  )
}

export default page