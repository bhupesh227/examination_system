import { db } from "@/firebase/admin";
import { createExamFeedback } from "@/lib/actions/feedback.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const { userId, examId, answers, score, submittedAt } = data;

        const subRef = await db.collection("submittedExams").add({
            userId,
            examId,
            answers,
            score,
            submittedAt,
          });
      
          // 2) Generate & store AI feedback
        const { success, feedbackId } = await createExamFeedback({
            examId,
            userId,
            answers,
        });
      
        if (!success) {
            console.error("Feedback generation failed");
        }
      
          // 3) Return both IDs
        return NextResponse.json({
            success: true,
            submissionId: subRef.id,
            feedbackId: feedbackId || null,
        });
    } catch (error) {
        console.error("Error submitting exam:", error);
        return NextResponse.json({ success: false, error: "Submission failed" }, { status: 500 });
    }
}
