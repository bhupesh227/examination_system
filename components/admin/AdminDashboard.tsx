"use server";
import React from "react";
import Link from "next/link";
import {
  getTotalStudents,
  getTotalTeachers,
  getAdminCreatedExams,
  getTeacherCreatedExams,
} from "@/lib/actions/admin.action";
import EditExamCard from "../EditExamCard";

const AdminDashboard = async () => {
  
  const [totalStudents, totalTeachers, adminExams, teacherExams] = await Promise.all([
    getTotalStudents(),
    getTotalTeachers(),
    getAdminCreatedExams(),
    getTeacherCreatedExams(),
  ]);

  const hasMoreAdminExams = adminExams.length > 2;
  const displayedAdminExams = adminExams.slice(0, 2); 
  
  const hasMoreTeacherExams = teacherExams.length > 2;
  const displayedTeacherExams = teacherExams.slice(0, 2); 

  return (
    <div className="flex min-h-screen max-sm:p-0 gap-8">
      <div className="w-[1px] bg-gray-600 max-sm:hidden"></div>
      
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-gray-700 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Total Students</h2>
            <p className="text-3xl font-bold">{totalStudents}</p>
          </div>
          <div className="p-4 bg-gray-700 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Total Teachers</h2>
            <p className="text-3xl font-bold">{totalTeachers}</p>
          </div>
          <div className="p-4 bg-gray-700 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Admin Exams</h2>
            <p className="text-3xl font-bold">{adminExams.length}</p>
          </div>
        </div>

        {/* Admin Created Exams Preview */}
        <section className="flex flex-col gap-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Admin Created Exams</h2>
          {adminExams.length ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {displayedAdminExams.map((exam) => (
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
              {hasMoreAdminExams && (
                <div className="mt-4 flex justify-end">
                  <Link
                    href="/admin-dashboard/AllGeneratedExams"
                    className="text-teal-600 hover:underline"
                  >
                    View all admin exams
                  </Link>
                </div>
              )}
            </>
          ) : (
            <p className="ml-3 text-amber-200">No exams created by admin yet.</p>
          )}
        </section>

        {/* Teacher Created Exams Preview */}
        <section className="flex flex-col gap-6 mt-12">
          <h2 className="text-2xl font-semibold mb-4">Teacher Created Exams</h2>
          {teacherExams.length ? (
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
                    href="/admin-dashboard/AllGeneratedExams"
                    className="text-teal-600 hover:underline"
                  >
                    View all teacher exams
                  </Link>
                </div>
              )}
            </>
          ) : (
            <p className="ml-3 text-amber-200">No exams created by teachers yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;