
import ClientExamBody from "./ClientExamBody";

interface ExamViewerProps {
    exam: ExamFormInfoProps;
    user: { id: string; };
  }

export default function ExamViewer({ exam ,user}: ExamViewerProps ) {
    return (
        <div>
            <ClientExamBody 
                questions={exam.questions} 
                duration={exam.duration} 
                examId={exam.id} 
                userId={user.id}
                description={exam.description}
                title={exam.title}
            />
        </div>
    );
}
