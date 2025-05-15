"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { Button } from "./ui/button";

interface EditExamCardProps {
  examId: string;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  questions: Question[];
  createdAt: string;
  role: string;
}

const EditExamCard = ({
  examId,
  title,
  description,
  duration,
  questions,
  createdAt,
  role,
}: EditExamCardProps) => {
  // Normalize role for display
  const normalizedRole = /mix/gi.test(role) ? "Unknown" : role;
  const roleBadgeColor =
    {
      Unknown: "bg-light-800",
      teacher: "bg-yellow-200",
      admin: "bg-blue-200",
    }[normalizedRole] || "bg-violet-600";

  const formattedDate = dayjs(createdAt).format("MMM D, YYYY");

  
  const editPath = `/edit-exam/${examId}`;

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96 p-2 bg-white rounded-lg shadow-md">
      <div className="card-exam relative">
        
          <div>
              <div className={`absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg z-10 ${roleBadgeColor}`}>
                  <p className="badge-text font-medium text-black">{normalizedRole}</p>
              </div>
              
              <div className="absolute top-0 left-0 w-fit px-4 py-2 rounded-br-lg z-10 bg-teal-600">
                  <p className="badge-text font-medium text-white">
                      
                  </p>
              </div>
              
              <Image
                src="/elevated-view-laptop-stationeries-blue-backdrop.jpg"
                alt="cover-image"
                width={90}
                height={90}
                className="rounded-lg w-full object-cover mt-6 mx-auto"
              />
              <h3 className="my-5 capitalize">{title}</h3>

              <div className="flex flex-row flex-wrap gap-5 mt-3">
                <div className="flex flex-row gap-2">
                    <Image src="/calendar.svg" width={22} height={22} alt="calendar icon" />
                    <p>{formattedDate}</p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <Image
                    src="/duration.svg"
                    width={22}
                    height={22}
                    alt="duration icon"
                  />
                  <p>{duration} min</p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Image src="/question.svg" width={22} height={22} alt="question icon" />
                    <p>{questions?.length || 0}</p>
                </div>
              </div>

              <p className="line-clamp-2 mt-5 text-teal-400">{description}</p>
          </div>
        <div className="flex justify-center items-center mt-4 ">
          <Link
            href={editPath}
            className="bg-teal-600 text-white p-1 rounded-lg hover:bg-teal-700 transition-all duration-200 ease-in-out"
          >
            <Button className="cursor-pointer">Edit Exam</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditExamCard;