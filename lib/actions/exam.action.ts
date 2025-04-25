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
    const Createdexams = await db
      .collection("createdExams")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
  
    return Createdexams.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ExamFormInfoProps[];
}

export async function getExamById(examId: string): Promise<ExamFormInfoProps | null> {
    try {
        const examDoc = await db.collection("createdExams").doc(examId).get();
        if (!examDoc.exists) {
            return null;
        }
        return {
            id: examDoc.id,
            ...examDoc.data(),
        } as ExamFormInfoProps;
    } catch (error) {
        console.error("Error fetching exam:", error);
        return null;
    }
}

export async function updateExamForm(examId: string, data: ExamFormInfo): Promise<{ success: boolean; message: string }> {
    try {
      
      const updatedAt = new Date().toISOString();
      await db.collection("createdExams").doc(examId).update({
        ...data,
        updatedAt,
      });
      return {
        success: true,
        message: "Exam updated successfully",
      };
    } catch (error) {
      console.error("Error updating exam:", error);
      return {
        success: false,
        message: "Failed to update exam. Please try again.",
      };
    }
  }