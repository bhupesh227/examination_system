"use server";
import { db } from "@/firebase/admin";

// Fetch total students count from "users" collection
export async function getTotalStudents(): Promise<number> {
  const snapshot = await db.collection("users").where("role", "==", "student").get();
  return snapshot.size;
}

// Fetch total teachers count from "users" collection
export async function getTotalTeachers(): Promise<number> {
  const snapshot = await db.collection("users").where("role", "==", "teacher").get();
  return snapshot.size;
}

// Fetch exams created by admin
export async function getAdminCreatedExams(): Promise<ExamFormInfoProps[]> {
  const snapshot = await db
    .collection("createdExams")
    .where("role", "==", "admin")
    .orderBy("createdAt", "desc")
    .limit(3)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ExamFormInfoProps[];
}

// Fetch exams created by teacher
export async function getTeacherCreatedExams(): Promise<ExamFormInfoProps[]> {
  const snapshot = await db
    .collection("createdExams")
    .where("role", "==", "teacher")
    .orderBy("createdAt", "desc")
    .limit(3)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ExamFormInfoProps[];
}