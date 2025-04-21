"use client"
import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from './ui/form'
import FormField from './FormField'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from "sonner"


const authFormSchema =(type:FormType)=>{
    return z.object({
        username: z.string().min(2).max(50),
        email: z.string().email().min(5).max(50),
        password: z.string().min(8).max(50),
        confirmPassword: z.string().min(8).max(50),
    })
    .refine((data) => {
        if (type === "LogIn") return true
        return data.password === data.confirmPassword
    }, {
        message: "Passwords don't match",
    })
}
const Authforms = ({type}:{type:FormType}) => {
    const formSchema = authFormSchema(type)
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
    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            
        } catch (error) {
            console.log(error);
            toast.error(`There was an error: ${error}`)
        }
    }
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
                        description='This is your email'
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        description='This is your password'
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