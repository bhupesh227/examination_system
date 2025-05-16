"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function SignUpUser(data: SignUpParams){
    const {uid ,username, email, password} = data;
    try {
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists) {
          if (!password) {
            return {
                success: true,
                message: "Google account already exists. Proceeding with sign-in.",
            };
          }
          return {
              success: false,
              message: "User already exists"
          }
        }
        let avatarURL = "/avatardefault.jpg";
        const role = "student";
        if (!password) {
          try {
            const authUser = await auth.getUser(uid);
            if (authUser.photoURL) {
              avatarURL = authUser.photoURL;
            }
          } catch (photoError) {
            console.error("Error getting user photo:", photoError);
            
          }
        }
        await db.collection("users").doc(uid).set({
            username,
            email,
            createdAt: new Date().toISOString(),
            authProvider: password ? "local": "google",
            avatarURL,
            role,
        });
        return {
            success: true,
            message: password ? "User created successfully" : "User signed in successfully",
        };
        
    } catch (error: unknown) {
        console.error("Error creating user:", error);
        if ((error as { code?: string }).code === "auth/email-already-exists") {
          return {
            success: false,
            message: "This email is already in use",
          };
        }
    
        // More specific error handling for decoder errors
        if (error instanceof Error && error.message.includes("DECODER routines")) {
          return {
            success: false,
            message: "Database connection error. Please try again later.",
          };
        }
        return {
          success: false,
          message: "Failed to create account. Please try again.",
        };
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
    const expiresIn = 60 * 60 * 24 * 5; // 5 days in seconds
    const sessionCookie = await auth.createSessionCookie(
        idToken, 
        { expiresIn: expiresIn * 1000 }
    );
    cookieStore.set("session", sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
}

export async function LogInUser(data: LogInParams){
    const {email, idToken} = data;

    try {
        // const userRecord = await db.collection("users").where("email", "==", email).get();
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: "User not found"
            }
        }
        await setSessionCookie(idToken);
        return {
            success: true,
            message: "User logged in successfully",
        };
        
    } catch (error:unknown) {
        console.log(error);
        return{
            success: false,
            message: "Failed to LogIn"
        }
    }
}
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
  
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;
  
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
  
      const userRecord = await db
        .collection("users")
        .doc(decodedClaims.uid)
        .get();
      if (!userRecord.exists) return null;
  
      return {
        ...userRecord.data(),
        id: userRecord.id,
      } as User;
    } catch (error) {
      console.log(error);
  
      // Invalid or expired session
      return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

export async function LogOutSession() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}


export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in"); 
  }
  return user;
}