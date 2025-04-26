
import ExamViewer from "@/components/ExamViewer";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getExamById } from "@/lib/actions/exam.action";

export default async function ExamPage({params}:RouteParams) {
    const { id } = await params;
    const exam = await getExamById(id);
    const user = await getCurrentUser();

    if (!exam) return <div>Exam not found.</div>;

    return (
        <div className="p-8">
            {user && <ExamViewer exam={exam} user={user} />}
        </div>
    );
}
