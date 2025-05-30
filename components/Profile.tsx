"use client";
import { LogOutSession } from '@/lib/actions/auth.action';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';
import Avatars from './Avatars';
import { Button } from './ui/button';

interface ProfileProps {
    user: User;
    totalExamsGiven: number;
    adminTotalExams?: number;
    teacherExamsCreated?: number;
  }

const Profile = ({ user, totalExamsGiven,adminTotalExams,teacherExamsCreated }: ProfileProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const handleLogOut = async () => {
        try {
            setIsLoading(true);
            await LogOutSession();
            toast.success("Logged out successfully.");
            router.push("/sign-in");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed. Please try again.");
        }finally{
            setIsLoading(false);
        }
    }
  return (
    <>
      <section className="profile">
        <div className="id-card">
          <div className="inner">
            <div className="badge">
              <div className="badge-inner" />
            </div>


            <div className="mt-20 flex flex-row items-center gap-3">
                <Avatars userId={user.id} userName={user.username} currentAvatar={user.avatarURL}/>

              <div>
                <p className="text-2xl font-semibold text-white">
                  {user.username}
                </p>
                <p className="text-base text-light-100">{user.email}</p>
              </div>
            </div>

           
              
            <Button type="submit" variant="destructive" className="logout cursor-pointer" onClick={handleLogOut} disabled={isLoading}>
                Logout
            </Button>
             
            

            <div className="mt-5">
              <p className="text-lg text-light-100">University: </p>
              <p className="text-2xl font-semibold text-white">
                Nainital Technical University
              </p>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <p className="text-lg text-light-100">Role :</p>
              <p className="text-2xl font-semibold text-white">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>
             
            <div className='mt-5 flex items-center gap-2'>
                <p className='text-lg text-light-400'>Created At:</p>
                <p className='text-light-100'>
                  {user.createdAt}
                </p>
            </div>

            {user.role === "student" ? (
              <div className='mt-5 flex items-center gap-2'>
                <p className='text-lg text-light-400'>Total Exams Taken:</p>
                <p className='text-light-100'>{totalExamsGiven}</p>
              </div>
            ) : user.role === "teacher" ? (
              <div className='mt-5 flex items-center gap-2'>
                <p className='text-lg text-light-400'>Exams You Created:</p>
                <p className='text-light-100'>{teacherExamsCreated}</p>
              </div>
            ) : user.role === "admin" && (
              <div className='mt-5 flex items-center gap-2'>
                <p className='text-lg text-light-400'>Total Admin Exams:</p>
                <p className='text-light-100'>{adminTotalExams}</p>
              </div>
            )}
            

            <div className="validity ">
              <p >
                Valid for {new Date().getFullYear()}-
                {new Date().getFullYear() + 1} Academic Year
              </p>
            </div>
          </div>
          
          
        </div>
      </section>
    </>
  )
}

export default Profile
