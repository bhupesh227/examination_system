import React from 'react'
import Link from 'next/link';
import EditExamCard from '../EditExamCard';
import { getTotalStudents, getTotalTeachers } from '@/lib/actions/admin.action';
import { getCreatedExamsByUserId } from '@/lib/actions/exam.action';
import { requireUser } from '@/lib/actions/auth.action';


const TeacherDashboard = async () => {
    const user = await requireUser();
    const [totalStudents, totalTeachers, teacherExams] = await Promise.all([
      getTotalStudents(),
      getTotalTeachers(),
      getCreatedExamsByUserId(user.id),
    ]);
 
    const hasMoreTeacherExams = (teacherExams?.length || 0) > 2;
    const displayedTeacherExams = (teacherExams || []).slice(0, 2); 

  return (
    <div className="flex min-h-screen gap-8">
      <div className="w-[1px] bg-gray-600 max-sm:hidden"></div>
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-gray-700 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Total Users</h2>
            <p className="text-3xl font-bold">{totalStudents}</p>
          </div>
          <div className="p-4 bg-gray-700 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Total Teachers</h2>
            <p className="text-3xl font-bold">{totalTeachers}</p>
          </div>
          <div className="p-4 bg-gray-700 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Your Generated Exam</h2>
            <p className="text-3xl font-bold">{teacherExams?.length || 0}</p>
          </div>
        </div>

        <section className="flex flex-col gap-6 mt-12">
          <h2 className="text-2xl font-semibold mb-4">Teacher Created Exams</h2>
          {teacherExams?.length ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 self-center justify-center">
                {displayedTeacherExams.map((exam) => (
                  <EditExamCard
                    key={exam.id}
                    
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
              {hasMoreTeacherExams && (
                <div className="mt-4 flex justify-center">
                  <Link
                    href="/teacher-dashboard/YourGeneratedExams"
                    className="text-teal-600 hover:underline"
                  >
                    View all teacher exams
                  </Link>
                </div>
              )}
            </>
          ) : (
            <p className="ml-3 text-amber-200">No exams created by you yet.</p>
          )}
        </section>
      </main>
    </div>
  )
}

export default TeacherDashboard