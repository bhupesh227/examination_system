"use client"
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from './ui/form'
import FormField from './FormField'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from "sonner"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth } from '@/firebase/client'
import { LogInUser, SignUpUser } from '@/lib/actions/auth.action'
import { useRouter } from 'next/navigation'


const authFormSchema =(type:FormType)=>{
    return (z.object({
        username: type ==='SignUp'? z.string().min(5,"minimun 5 chracters"):z.string().optional(),
        email: z.string().email().min(5).max(50),
        password: z.string().min(8).max(50),
        confirmPassword: type ==='SignUp'? z.string().min(8).max(50): z.string().optional(),
    })
    .refine((data) => {
        if (type === "LogIn") return true
        return data.password === data.confirmPassword
    }, {
        message: "Passwords don't match",
    }))
}
const Authforms = ({type}:{type:FormType}) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const LogIn = type === "LogIn"
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (type === "SignUp") {
                const  { username, email, password } = values;
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                const result = await SignUpUser({
                    uid: userCredentials.user.uid,
                    username: username!,
                    email,
                    password,
                })
                if (!result?.success) {
                    toast.error(result?.message)
                }
                toast.success("Sign Up Successful")
                router.push("/sign-in")
            }else{
                const {email, password} = values;
                let userCredentials;
                try {
                    userCredentials = await signInWithEmailAndPassword(auth, email, password);
                } catch (error: any) {
                    if (error.code === "auth/invalid-credential") 
                    {
                        toast.error("Invalid credentials");
                        return;
                        
                    }
                    else if(error.code === "auth/user-not-found")
                    {
                        toast.error("User does not exist");
                        return;
                    }
                    toast.error(error.message || "Failed to LogIn");
                    return;
                }
                const idToken = await userCredentials.user.getIdToken();
                if(!idToken){
                    toast.error("Failed to LogIn")
                    return;
                }

                await LogInUser({
                    email,
                    idToken,
                })
                toast.success("Logged In successfully");
                
            }
        } catch (error) {
            console.log(error);
            toast.error(`${error}`)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            setIsGoogleLoading(true);
            const provider = new GoogleAuthProvider();
            
            // Add these settings to help with the sign-in experience
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            try {
                const userCredential = await signInWithPopup(auth, provider);
                
                // Get user info
                const user = userCredential.user;
                
                // Get the ID token
                const idToken = await user.getIdToken();

                
                // Always try to create/update the user record in your database
                const signUpResult = await SignUpUser({
                    uid: user.uid,
                    username: user.displayName || 'User',
                    email: user.email || '',
                    password: '' 
                });
                
                if (!signUpResult?.success) {
                    toast.error(signUpResult?.message || 'Failed to create account');
                    setIsGoogleLoading(false);
                    return;
                }
                
                // Sign in the user with your backend
                const signInResult = await LogInUser({
                    email: user.email || '',
                    idToken
                });
                
                if (!signInResult?.success) {
                    toast.error(signInResult?.message || 'Failed to sign in');
                    setIsGoogleLoading(false);
                    return;
                }
                
                toast.success('Signed in successfully with Google');
                
                // Use router.replace instead of push to avoid navigation issues
                router.replace('/');
            } catch (popupError: unknown) {
                console.error("Popup error:", popupError);
                
                if ((popupError as { code?: string }).code === 'auth/popup-closed-by-user' ||
                    (popupError as { code?: string }).code === 'auth/popup-blocked' ||
                    (popupError as Error).message?.includes('Cross-Origin-Opener-Policy')) {
                    
                    toast.error('Popup authentication failed. Please try again.');
                    throw popupError; // Re-throw to be caught by the outer catch
                }
            }
        } catch (error: unknown) {
            console.error('Google sign-in error:', error);
            
            // Handle specific error cases
            if ((error as { code?: string }).code === 'auth/popup-closed-by-user') {
                toast.error('Sign-in cancelled. Please try again.');
            } else if ((error as { code?: string }).code === 'auth/popup-blocked') {
                toast.error('Pop-up blocked by browser. Please allow pop-ups for this site.');
            } else {
                toast.error(`Google sign-in failed: ${(error as Error)?.message || 'Unknown error'}`);
            }
        } finally {
            setIsGoogleLoading(false);
        }
    };
  return (
    
    <div className="card-border lg:min-w-[500px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
                <Image src="/logo.svg" alt="logo" height={32} width={38} />
                <h2 className="text-primary-100">ExamDo</h2>
            </div>

            <h3 className='text-center'>Nainital Technical University</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit,(errors)=>{
                    Object.values(errors)
                    .map((error:any)=>error?.message)
                    .filter(Boolean)
                    .forEach((error:string) => {
                        toast.error(error, {
                            description: "Please check your input",
                            duration: 3000,
                        })
                    })
                })} className="w-full space-y-6 mt-4 form">
                    {!LogIn && (
                        <FormField
                            control={form.control}
                            name="username"
                            label="Username"
                            placeholder="Enter your username"
                            description='This is your username'
                        />
                    )}
                    <FormField
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                        description=''
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        description=''
                    />
                    {!LogIn && (
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            type="password"
                            description='This is your password'
                        />
                    )}
                    <Button className='btn' type="submit">
                        {LogIn ? "Log In" : "Sign Up"}
                    </Button>
                </form>
            </Form>
            <div className="relative flex items-center justify-center mt-2 mb-1">
                <div className="absolute border-t border-gray-700 w-full"></div>
                <span className="relative px-4 bg-gray-700 text-light-300 text-sm rounded-lg">or</span>
            </div>

            <Button 
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-2 border-gray-700 hover:bg-dark-300 transition-colors cursor cursor-pointer"
            >
              {isGoogleLoading ? (
                <span className="animate-spin h-4 w-4 border-2 border-primary-200 rounded-full border-t-transparent"></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
              )}
              <span>{LogIn ? "Log In with Google" : "Sign up with Google"}</span>
            </Button>

            <p className='text-center flex flex-col sm:flex-row gap-3 justify-center mt-1 text-light-100'>
                {LogIn ? "Don't have an account?" : "Already have an account?"}{" "}
                <Link href={LogIn ? "/sign-up" : "/sign-in"} className='text-green-600 font-bold'>
                    {LogIn ? "Sign Up" : "Log In"}
                </Link>
            </p>
        </div>
    </div>
  )
}

export default Authforms