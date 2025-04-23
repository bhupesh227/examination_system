
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96 p-4 bg-white rounded-lg shadow-md relative">
      <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-2 rounded-bl-lg text-sm">
        {role}
      </div>

      <h2 className="text-xl font-bold mt-4 text-center">{title}</h2>
      <p className="text-sm text-gray-600 text-center">{description}</p>

      <div className="flex flex-wrap gap-4 mt-6 justify-center">
        <div className="flex items-center gap-2">
          <Image src="/calendar.svg" width={20} height={20} alt="calendar" />
          {/* <span className="text-sm">{formattedDate}</span> */}
        </div>

        <div className="flex items-center gap-2">
          <Image src="/clock.svg" width={20} height={20} alt="duration" />
          <span className="text-sm">{duration} min</span>
        </div>

        <div className="flex items-center gap-2">
          <Image src="/question.svg" width={20} height={20} alt="questions" />
          <span className="text-sm">{questions?.length || 0} questions</span>
        </div>

        <div className="flex items-center gap-2">
          <Image src="/check.svg" width={20} height={20} alt="marks" />
          <span className="text-sm">Pass: {passingMarks}/{totalMarks}</span>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Link href={`/exam/${examId}`} className="btn btn-primary">
          View / Take Exam
        </Link>
      </div>
    </div>
  )
}

export default ExamCard