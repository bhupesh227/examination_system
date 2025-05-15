import { requireUser } from '@/lib/actions/auth.action';
import { getAllStudentsRanking } from '@/lib/actions/general.action';
import React from 'react';

interface RankingRow {
  userId: string;
  name: string;
  totalMarks?: number;
  email: string;
  missing?: boolean;
}

const Ranking = async () => {
  const user = await requireUser();
  const ranking: RankingRow[] = await getAllStudentsRanking();

  
  const userInRanking = ranking.find((row) => row.userId === user.id);
  if (!userInRanking) {
    ranking.push({
      userId: user.id,
      name: user.username,
      email: user.email,
      missing: true,
    });
  }


  const rankingWithScore = (
    ranking
      .filter(
        (row) =>
          typeof row.totalMarks === 'number' && !isNaN(row.totalMarks)
      ) as RankingRow[]
  ).sort((a, b) => b.totalMarks! - a.totalMarks!);

  const hasMissing = !rankingWithScore.some((row) => row.userId === user.id);

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">All Ranking</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2 text-left">Position</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Total Marks</th>
            <th className="p-2 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {rankingWithScore.map((student, index) => (
            <tr
              key={`${student.userId}-${index}`}
              className={`border-b ${student.userId === user.id ? 'bg-blue-400' : ''}`}
            >
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{student.name}</td>
              <td className="p-2">
                {isNaN(student.totalMarks!) ? '---' : student.totalMarks}
              </td>
              <td className="p-2">{student.email}</td>
            </tr>
          ))}

          {hasMissing && (
            <tr
              key={`${user.id}-missing`}
              className="border-b bg-red-100"
            >
              <td className="p-2">{rankingWithScore.length + 1}</td>
              <td className="p-2">{user.username} (You)</td>
              <td className="p-2">---</td>
              <td className="p-2">{user.email}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Ranking;