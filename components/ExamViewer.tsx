
import ClientExamBody from "./ClientExamBody";

export default function ExamViewer({ exam }: { exam: ExamFormInfoProps }) {
    return (
        <div>
            <ClientExamBody 
                questions={exam.questions} 
                duration={exam.duration} 
                examId={exam.id} 
                userId={exam.userId}
                description={exam.description}
                title={exam.title}
            />
        </div>
    );
}
