import { db } from "@/firebase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const { userId, examId, answers, score, submittedAt } = data;

        await db.collection("submittedExams").add({
            userId,
            examId,
            answers,
            score,
            submittedAt,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error submitting exam:", error);
        return NextResponse.json({ success: false, error: "Submission failed" }, { status: 500 });
    }
}
