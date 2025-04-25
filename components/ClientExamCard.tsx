"use client";

interface ClientInterviewCardProps {
  interview: ExamFormInfoProps;
  userId?: string;
  ExamCard: React.ReactNode;
}

export default function ClientInterviewCard({ 
  ExamCard 
}: ClientInterviewCardProps) {
  return (
    <>
      {ExamCard}
    </>
  );
}