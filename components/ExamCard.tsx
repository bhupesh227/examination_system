
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'
import { Button } from './ui/button'
import { getFeedbackByExamUserId } from '@/lib/actions/feedback.action'
import { getSubmissionByExamUserId } from '@/lib/actions/submittedExam.action'

const ExamCard = async({
    examId,
    userId,
    title,
    description,
    duration,
    totalMarks,
    passingMarks,
    questions,
    createdAt,
    role
}:ExamCardProps) => {
  const feedback =
    userId && examId
      ? await getFeedbackByExamUserId({ examId, userId,})
      : null;
 

  const submission = userId && examId
    ? await getSubmissionByExamUserId({ examId, userId })
    : null;


  const normalizedRole = /mix/gi.test(role) ? "student" : role;

  // Type badge color mapping
  const roleBadgeColor =
    {
      student: "bg-light-800",
      teacher: "bg-yellow-200",
      admin: "bg-blue-200",
    }[normalizedRole] || "bg-violet-600";


    const formattedDate = dayjs(
       createdAt 
    ).format("MMM D, YYYY");
  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96 p-2 bg-white rounded-br-lg shadow-md'>
      <div className='card-exam'>
        <div>
          <div className={`absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg z-10 ${roleBadgeColor}`}>
            <p className='badge-text font-medium text-black'>{normalizedRole}</p>
            
          </div>

          <div className={`absolute top-0 left-0 w-fit px-4 py-2 rounded-br-lg z-10 bg-teal-600`}>
            <p className="badge-text font-medium text-white capitalize">Passing Marks:{passingMarks || ""}</p>
          </div>
          <Image
            src='/elevated-view-laptop-stationeries-blue-backdrop.jpg'
            alt="cover-image"
            width={90}
            height={90}
            className="rounded-lg w-full object-cover mt-6 mx-auto"
          />
          <h3 className="my-5 capitalize text-center">{title} </h3>

          <div className="flex flex-row flex-wrap gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar icon"
              />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image 
                src="/star-2.svg" 
                width={22} 
                height={22} 
                alt="star icon"
              />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
            
            <div className="flex flex-row gap-2 items-center">
              <Image 
                src="/question.svg" 
                width={22} 
                height={22} 
                alt="question icon" 
              />
              <p>
                {questions?.length || 0}
              </p>
            </div>
          </div>

          <div className='flex flex-row gap-2 justify-center items-center mt-2'>
            <Image
              src="/duration.svg"
              width={22}
              height={22}
              alt="duration icon"
            />
            <p>{duration} min</p>
          </div>

          <p className="line-clamp-2 mt-2 text-center">
            {feedback ?(
              <span className='text-teal-600 font-semibold'>ou haven&apos;t taken this Exam yet. Take it now to improve your skills.</span>
            ) : (
              <span className='text-teal-600 font-semibold'>{description}</span>
            )}
          </p>
        </div>

        <div className='flex justify-center items-center mt-3 cursor-pointer'>
          {submission && feedback ? (
            <div className="flex justify-center items-center gap-2">
              <Link
                href={`/exam/${examId}/feedback`}
                className="bg-teal-600 text-white p-1 rounded-lg hover:bg-teal-700 transition-all duration-200 ease-in-out"
              >
                <Button className="cursor-pointer">View Feedback</Button>
              </Link>
              <Link
                href={`/exam/${examId}/result`}
                className="bg-green-600 text-white p-1 rounded-lg hover:bg-green-700 transition-all duration-200 ease-in-out"
              >
                <Button className="cursor-pointer">View Result</Button>
              </Link>
            </div>
          ) : (
            <Link
              href={`/exam/${examId}`}
              className="bg-teal-600 text-white p-1 rounded-lg hover:bg-teal-700 transition-all duration-200 ease-in-out"
            >
              <Button className="cursor-pointer">Take Exam</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
    
  )
}

export default ExamCard