
import ExamViewer from "@/components/ExamViewer";
import { getExamById } from "@/lib/actions/exam.action";

export default async function ExamPage({params}:RouteParams) {
    const { id } = await params;
    const exam = await getExamById(id);

    if (!exam) return <div>Exam not found.</div>;

    return (
        <div className="p-8">
            <ExamViewer exam={exam} />
        </div>
    );
}
