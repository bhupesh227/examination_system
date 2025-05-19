import React from 'react'
import Image from 'next/image';

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-6 rounded-2xl">
      
      <section className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
            Welcome to ExamDo
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            ExamDo is a modern examination platform where teachers and admins can
            create engaging tests, and students can take them in a secure,
            interactive environment. Track performance, get instant feedback,
            and see your ranking in real time.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mt-1 text-blue-600">✓</span>
              <span className="ml-2 text-gray-800">
                Create, edit, and schedule exams with ease
              </span>
            </li>
            <li className="flex items-start">
              <span className="mt-1 text-blue-600">✓</span>
              <span className="ml-2 text-gray-800">
                Secure proctoring features to prevent malpractice
              </span>
            </li>
            <li className="flex items-start">
              <span className="mt-1 text-blue-600">✓</span>
              <span className="ml-2 text-gray-800">
                Detailed feedback and ranking for every student
              </span>
            </li>
          </ul>
        </div>
        <div className="flex-1">
          <Image
            src="/logo.svg"
            alt="ExamDo overview"
            width={500}
            height={350}
            className="rounded-lg shadow-lg p-4"
          />
        </div>
      </section>

      
      <section className="max-w-4xl mx-auto mt-16 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-700">
          We believe assessment should be simple, transparent, and engaging.
          ExamDo empowers educators to build dynamic exams, while giving
          students a seamless test-taking experience. Insights and analytics
          help everyone improve and succeed.
        </p>
      </section>

      
      <section className="max-w-5xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <Image
            src="/avatardefault.jpg"
            alt="Developer portrait"
            width={300}
            height={300}
            className="rounded-full mx-auto shadow-md"
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-blue-900">
            Meet the Developers
          </h3>
          <p className="text-gray-800">
            Hi, We are Bhupesh, Sumit, Manish, Chandan, and Shubham — the creators of ExamDo. We built this platform to
            streamline online assessments and provide actionable feedback to
            learners everywhere. With a passion for education and software
            design, We are committed to continual improvement and innovation.
          </p>
          <div className="flex space-x-4 justify-center md:justify-start">
            <a
              href="https://github.com/bhupesh227"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/bhupesh-bora-2b4s"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default page