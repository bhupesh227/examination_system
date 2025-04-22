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