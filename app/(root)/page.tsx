import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = async() => {
  const user = await getCurrentUser();
  let startLink = "/AllExams";
  let dynamicDescription = "Create, assign, and manage exams effortlessly with real-time analytics.";
  if (user) {
    if (user.role === "teacher") {
      startLink = "/teacher-dashboard";
      dynamicDescription = "Create, assign, and manage exams effortlessly with real-time analytics.";
    } else if (user.role === "admin") {
      startLink = "/admin-dashboard"; 
      dynamicDescription = "Manage users and oversee the examination process.";
    } else if (user.role === "student") {
      startLink = "/AllExams";
      dynamicDescription = "Take exams and track your progress.";
    }
  }
  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <section className="card-cta flex-col md:flex-row text-center mb-16 mt-10 pb-10 gap-5">
          <div className='flex flex-col justify-center items-center gap-4 md:gap-2'>
            <h1 className="text-5xl font-bold mb-4 text-orange-400">
              Hi {user?.username} <br/> <span className='text-3xl font-bold text-orange-200'> Welcome to Online Examination System</span>
            </h1>
            <p className="text-xl text-amber-200 mb-8">
              {dynamicDescription}
            </p>
            <div className="space-x-4">
              <Button variant="outline" size="lg">
                <Link href={startLink}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
          <Image
          src={"/exams/3d-view-books.png"}
          alt="Exam Image"
          width={500}
          height={300}
          className='w-[250px] sm:w-[400px] mx-auto mb-0 sm:mx-0 sm:mb-4 md:mb-0'
        />
        </section>
        
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            <div className="bg-white p-6 rounded shadow blue-gradient-dark">
              <h3 className="text-2xl font-bold mb-2">User Management</h3>
              <p>
                Handle user profiles and roles with an easy-to-use administrative panel.
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow blue-gradient-dark">
              <h3 className="text-2xl font-bold mb-2">Real-time Exams</h3>
              <p>
                Seamlessly create, assign, monitor, and manage exams in real-time.
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow blue-gradient-dark">
              <h3 className="text-2xl font-bold mb-2">Instant Results</h3>
              <p>
                Get immediate exam feedback along with detailed analytical reports.
              </p>
            </div>
          </div>
        </section>

      
      </main>
    </>
  )
}

export default page