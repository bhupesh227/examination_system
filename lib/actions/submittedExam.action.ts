"use server";
import { db } from "@/firebase/admin";

export async function getSubmissionByExamUserId(params: {
    examId: string;
    userId: string;
  }): Promise<SubmittedExamProps | null> {
    const { examId, userId } = params;
  
    const snapshot = await db
      .collection("submittedExams")
      .where("examId", "==", examId)
      .where("userId", "==", userId)
      .limit(1)
      .get();
  
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as SubmittedExamProps;
  }