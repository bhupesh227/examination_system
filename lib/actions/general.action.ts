"use server";

import {  db } from "@/firebase/admin";
export async function updateUserAvatar({ 
    userId, 
    avatarURL, 
  }: { 
    userId: string; 
    avatarURL: string;
  }) {
    try {
      const userRef = db.collection("users").doc(userId);
      
      await userRef.update({
        avatarURL
      });
      
      return { success: true, message: "Your avatar was updated successfully!"};
    } catch (error) {
      console.error("Error updating user avatar:", error);
      return { success: false, error };
    }
}

export async function getLatestExam(
  params: GetLatestExamParams
): Promise<ExamFormInfoProps[] | null> {
  // Use environment variable with fallback to 200 if not provided
  const defaultLimit = Number(process.env.NEXT_PUBLIC_MAX_EXAMCARD);
  const {  limit = defaultLimit } = params;

  const createdExams = await db
    .collection("createdExams")
    .orderBy("createdAt", "desc")
    .where("role", "in", ["Teacher", "Admin"])
    .limit(limit)
    .get();

  return createdExams.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ExamFormInfoProps[];
}