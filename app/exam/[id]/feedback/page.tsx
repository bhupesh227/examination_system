import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { getExamById } from "@/lib/actions/exam.action";
import { getFeedbackByExamUserId } from "@/lib/actions/feedback.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const exam = await getExamById(id);
  if (!exam) redirect("/");

  const feedback = await getFeedbackByExamUserId({
    examId: id,
    userId: user?.id ?? '',
  });

  return (
    <section className="section-feedback bg-stone-900/50 px-4 lg:px-8 py-3 lg:py-8 rounded-3xl">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback:{" "}
          <span className="capitalize">{exam.title}</span> Exam
        </h1>
      </div>

      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-5 max-sm:flex-col max-sm:items-center">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star-2.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-orange-300 font-bold">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY HH:mm")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <p>{feedback?.finalAssessment}</p>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-5">
        <h2>Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index} className="md:ml-4">
            <p className="text-primary-200 font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3>Strengths:</h3>
        <ul className="md:ml-6">
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement:</h3>
        <ul className="md:ml-6">
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="buttons mt-4">
          <Link href="/AllExams">
            <Button 
              className="text-md px-8"
              variant="secondary"
            >
              Back to AllExam
            </Button>
          </Link>
          {/* <Link href={`/exam/${id}`}>
            <Button 
              className="text-md px-8"
              variant="ghost"
            >
              Retake Exam
            </Button>
          </Link> */}
      </div>
    </section>
  );
};

export default Feedback;