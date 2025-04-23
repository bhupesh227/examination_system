"use server";

import { auth, db } from "@/firebase/admin";

export async function setExamForm(data: ExamFormInfo){
    const {userId,title,description,duration,totalMarks,passingMarks,questions,role} = data;
    try {
        const userRecord = await auth.getUser(userId);
        if (!userRecord) {
            return {
                success: false,
                message: "User not found",
            };
        }
        const createdAt = new Date().toISOString();
        await db.collection("createdExams").add({
            userId,
            title,
            description,
            duration,
            totalMarks,
            passingMarks,
            questions,
            role,
            createdAt,
        })
        return {
            success: true,
            message: "Exam created successfully",
        };
    } catch (error) {
        console.error("Error creating exam:", error);
        return {
            success: false,
            message: "Failed to create exam. Please try again.",
        };
        
    }
}

export async function getCreatedExamsByUserId(
    userId: string
  ): Promise<ExamFormInfoProps[] | null> {
    const interviews = await db
      .collection("createdExams")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
  
    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ExamFormInfoProps[];
}