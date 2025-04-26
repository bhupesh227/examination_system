"use server";

import { db } from "@/firebase/admin";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { userExamFeedbackSchema } from "@/constants";


export async function createExamFeedback(params: CreateExamFeedbackParams) {
    const { examId, userId, answers, feedbackId } = params;
  
    try {
      // Compute raw score
      const totalCorrect = answers.filter(a => a.isCorrect).length;
      const totalScore = Math.round((totalCorrect / answers.length) * 100);
  
      // Format answers for the prompt
      const formattedAnswers = answers
        .map(
          (a, i) =>
            `${i + 1}. Q: ${a.question}\n   Your answer: ${a.selectedAnswer}\n   Correct answer: ${a.correctAnswer}\n   ${a.isCorrect ? "✓ Correct" : "✗ Incorrect"}`
        )
        .join("\n\n");
  
     
      const { object } = await generateObject({
        model: google("gemini-2.0-flash-001", {
          structuredOutputs: false,
        }),
        schema: userExamFeedbackSchema,
        prompt: `
            You are an AI that reviews a student's exam.  
            The student scored ${totalScore}/100 based on ${answers.length} questions.
            
            Please provide detailed feedback in these categories (score each 0–100):  
            - Accuracy: correctness of answers  
            - Technical Knowledge: depth of understanding
            - Clarity: readability and presentation
            
            Then list strengths, areas for improvement, and a final overall assessment.
            
            Here are the responses:
            ${formattedAnswers}
        `,
        system:
          "You are an expert educational assessor — be fair, constructive, and actionable.",
      });
  
      
      const feedback = {
        examId,
        userId,
        totalScore: totalScore,
        categoryScores: object.categoryScores,
        strengths: object.strengths,
        areasForImprovement: object.areasForImprovement,
        finalAssessment: object.finalAssessment,
        createdAt: new Date().toISOString(),
      };
  
      
      const feedbackRef = feedbackId
        ? db.collection("examFeedback").doc(feedbackId)
        : db.collection("examFeedback").doc();
  
      // Persist
      await feedbackRef.set(feedback);
  
      return { success: true, feedbackId: feedbackRef.id };
    } catch (error) {
      console.error("Error generating/storing exam feedback:", error);
      return { success: false };
    }
}


export async function getFeedbackByExamUserId(
    params: GetFeedbackByExamIdUserIdParams
  ): Promise<Feedback | null> {
    const { examId, userId } = params;
  
    const querySnapshot = await db
      .collection("examFeedback")
      .where("examId", "==", examId)
      .where("userId", "==", userId)
      .limit(1)
      .get();
  
    if (querySnapshot.empty) return null;
  
    const feedbackDoc = querySnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
  }