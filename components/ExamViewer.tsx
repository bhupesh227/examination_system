
import ClientExamBody from "./ClientExamBody";

export default function ExamViewer({ exam }: { exam: ExamFormInfoProps }) {
    return (
        <div>
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <p className="text-gray-600 mb-4">{exam.description}</p>

            {/* Pass to a client-side component for interactivity */}
            <ClientExamBody questions={exam.questions} duration={exam.duration} examId={exam.id} userId={exam.userId} />
        </div>
    );
}
