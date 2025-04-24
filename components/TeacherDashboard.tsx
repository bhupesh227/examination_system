import React from 'react'
import ExamCard from './ExamCard';
import Link from 'next/link';


const TeacherDashboard = ({user,createdExam}:teacherDashboardProps) => {
  
 
  const totalUsers = 120; 
  const averageMarks = 75.4; 
  const generatedQuestions = [
    "What is the capital of France?",
    "Explain Newton's second law.",
    "What is the boiling point of water?",
  ];
  const hasPastCreatedExams = (createdExam?.length ?? 0) > 0;
  const displayedExams = createdExam.slice(0, 2);

  return (
    <div className="flex min-h-screen p-4 max-sm:p-0">
      <main className="flex-1 p-0 ">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Total Users</h2>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Average Marks</h2>
            <p className="text-3xl font-bold">{averageMarks}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Generated Questions</h2>
            <p className="text-3xl font-bold">{generatedQuestions.length}</p>
          </div>
        </div>

        <section className='flex flex-col gap-6 mt-8'>
          
              {hasPastCreatedExams?(
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 justify-between self-center gap-6">
                    {displayedExams.map((exam) => (
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
                    ))}
                  </div>
                  {createdExam.length > 2 && (
                    <div className="mt-4">
                      <Link
                        href="/teacher-dashboard/GeneratedExams"
                        className="text-teal-600 hover:underline"
                      >
                        View all exams
                      </Link>
                    </div>
                  )}
                </>
              ):(
                <p>You haven&apos;t created any Exam yet</p>
              )}
          
        </section>
      </main>
    </div>
  )
}

export default TeacherDashboard