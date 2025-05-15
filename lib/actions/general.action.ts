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
    .where("role", "in", ["teacher", "admin"])
    .limit(limit)
    .get();

  return createdExams.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ExamFormInfoProps[];
}

export async function getLatestExamForStudent(
  params: GetLatestExamParamsStudent
): Promise<ExamFormInfoProps[] | null> {
  // Use environment variable with fallback to 200 if not provided
  const defaultLimit = Number(process.env.NEXT_PUBLIC_MAX_EXAMCARD);
  const limit = params.limit ?? defaultLimit;
  const skip = params.skip ?? 0;

  const createdExams = await db
    .collection("createdExams")
    .orderBy("createdAt", "desc")
    .where("role", "in", ["teacher", "admin"])
    .offset(skip) 
    .limit(limit)
    .get();

  return createdExams.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ExamFormInfoProps[];
}
interface GetTotalExamsGivenByStudentParams{
  userId: string;
}
// get total number of exams given by a student
export async function getTotalExamsGivenByStudent(
  params: GetTotalExamsGivenByStudentParams
): Promise<number> {
  const { userId } = params;

  const examsGiven = await db
    .collection("submittedExams")
    .where("userId", "==", userId)
    .get();

  return examsGiven.size;
}

export async function getAllStudentsRanking(): Promise<{ userId: string; name: string; totalMarks: number ; email: string}[]> {
  
  const feedbackSnapshot = await db.collection("examFeedback").get();

  
  const rankingMap = new Map<string, number>();
  feedbackSnapshot.forEach(doc => {
    const data = doc.data();
    const userId = data.userId as string;
    const totalScore = data.totalScore as number;
    rankingMap.set(userId, (rankingMap.get(userId) || 0) + totalScore);
  });

  // Build the ranking array. For each userId, fetch the user's name from the "users" collection.
  const rankingArray: { userId: string; name: string; totalMarks: number ; email:string }[] = [];
  
  for (const [userId, totalMarks] of rankingMap.entries()) {
    try {
      const userDoc = await db.collection("users").doc(userId).get();
      const name = userDoc.exists ? (userDoc.data()?.username as string || userId) : userId;
      const email = userDoc.exists ? (userDoc.data()?.email as string || userId) : userId;
      
      rankingArray.push({ userId , name, totalMarks, email });
    } catch (error) {
      // Fallback to userId if fetching user fails
      rankingArray.push({userId, name: userId, totalMarks, email: userId });
    }
  }

  // Sort in descending order by totalMarks
  rankingArray.sort((a, b) => b.totalMarks - a.totalMarks);
  return rankingArray;
}