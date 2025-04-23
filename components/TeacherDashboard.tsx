import React from 'react'
import ExamCard from './ExamCard';

const TeacherDashboard = ({user,createdExam}:teacherDashboardProps) => {
  
 
  const totalUsers = 120; 
  const averageMarks = 75.4; 
  const generatedQuestions = [
    "What is the capital of France?",
    "Explain Newton's second law.",
    "What is the boiling point of water?",
  ];
  const hasPastCreatedExams = (createdExam?.length ?? 0) > 0;
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-4">Teacher Info</h2>
        <p className="mb-2">
          <span className="font-semibold">Name:</span> {user?.username}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user?.email}
        </p>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6 bg-gray-100">
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

        <section>
          <div className='interview-section'>
              {hasPastCreatedExams?(
                createdExam.map((exam)=>(
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
        </section>
      </main>
    </div>
  )
}

export default TeacherDashboard