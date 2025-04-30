import React from "react";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getExamById } from "@/lib/actions/exam.action";
import { getSubmissionByExamUserId } from "@/lib/actions/submittedExam.action";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ResultPage( { params }: RouteParams) {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in"); 
    }

  
    const exam = await getExamById(id);
    if (!exam) {
        return <div>Exam not found.</div>;
    }

    // Fetch the user’s submission
    const submission = await getSubmissionByExamUserId({
        examId: id,
        userId: user.id,
    });
    if (!submission) {
        return <div>No submission found for this exam.</div>;
    }

    const totalQuestions = submission.answers.length;

  return (
    <main className="p-4 max-w-4xl mx-auto result-layout home-bg border-2 border-neutral-600 rounded-lg shadow-md">
      <h1 className="text-3xl text-orange-400 font-bold mb-6 text-center">{exam.title} <br /> ( Your Answers )</h1>
      <p className="mb-4">
        Points scored: {submission.score} / {totalQuestions}
      </p>

      {submission.answers.map((ans, idx) => {
        const isCorrect = ans.isCorrect;
        return (
          <div
            key={idx}
            className="mb-1 p-3 border border-neutral-300 rounded-lg"
          >
            <p className="font-semibold">
              Q{idx + 1}. {ans.question}
            </p>
            <p>
              Your answer:{" "}
              <span
                className={isCorrect ? "text-green-600" : "text-red-600"}
              >
                {ans.selectedAnswer}
              </span>
            </p>
            {!isCorrect && (
              <p className="text-sm text-gray-700">
                Correct answer: <span className="text-green-600">{ans.correctAnswer}</span>
              </p>
            )}
          </div>
        );
      })}

        <div className="flex justify-center items-center mt-4">
            <Link href={`/AllExams`} className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition-all duration-200 ease-in-out">
                <Button className="cursor-pointer">Back to Exam</Button>
            </Link>
        </div>
    </main>
  );
}