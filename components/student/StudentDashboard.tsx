import React from 'react'
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getAllStudentsRanking, getLatestExamForStudent, getTotalExamsGivenByStudent } from "@/lib/actions/general.action";
import Link from 'next/link';


const StudentDashboard = async() => {
    const user = await getCurrentUser();
    if (!user) return <div>Please log in</div>;

    const [exams, totalExamsGiven, ranking] = await Promise.all([
        getLatestExamForStudent({ userId: user.id, limit: 50 }),
        getTotalExamsGivenByStudent({ userId: user.id }),
        getAllStudentsRanking(),
    ]);
    
    const topRanking = ranking.slice(0, 4);
    const totalAvailableExams = exams?.length || 0;
    const UserTotalMarks = ranking.find((student) => student.userId === user.id)?.totalMarks || "---";
  return (
    <div className="flex min-h-screen">
        <div className="w-[1px] bg-gray-600 max-sm:hidden"></div>

        <main className="flex-1 p-6">
            <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
            <div className="grid grid-cols-3 gap-6 mb-8">
         
            <div className="p-4 bg-gray-700 rounded shadow text-center">
                <h2 className="text-xl font-semibold mb-2">Exams Given</h2>
                <p className="text-3xl font-bold">{totalExamsGiven}</p>
            </div>
            
            <div className="p-4 bg-gray-700 rounded shadow text-center">
                <h2 className="text-xl font-semibold mb-2">Total Exams</h2>
                <p className="text-3xl font-bold">{totalAvailableExams}</p>
            </div>
            
            <div className="p-4 bg-gray-700 rounded shadow text-center">
                <h2 className="text-xl font-semibold mb-2">Your Total Score</h2>
                <p className="text-3xl font-bold">{UserTotalMarks}</p>
            </div>
            </div>

            
            <section className="bg-gray-500 rounded shadow p-4">
                <h2 className="text-2xl font-semibold mb-4">Ranking :</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-700 rounded-lg">
                            <th className="p-2 text-left">Position</th>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Total Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topRanking.map((student, index) => (
                            <tr key={index} className="border-b">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{student.name}</td>
                            <td className="p-2">{student.totalMarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {ranking.length > 4 && (
                    <Link
                    href="/Ranking"
                    className="inline-block bg-green-300 text-dark-200 px-4 py-2 rounded-lg mt-2 "
                    >
                    View Full Ranking
                    </Link>
                )}
            </section>
        </main>
    </div>
  )
}

export default StudentDashboard
