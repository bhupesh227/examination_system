import ExamCard from '@/components/ExamCard';
import Pagination from '@/components/Pagination';
import {requireUser } from '@/lib/actions/auth.action';
import { getLatestExamForStudent } from '@/lib/actions/general.action';

import React from 'react';

interface PageProps {
    searchParams: Promise<Record<string, string>>
}

const page = async({ searchParams }: PageProps) => {
    const currentPage = Number((await searchParams).page) || 1;
    
    const limit = 6;
    const skip = (currentPage - 1) * limit;
    const user = await requireUser();

    const examResult = await getLatestExamForStudent({
        userId: user?.id || '',
        limit: limit + 1,
        skip
    });

    const hasNextPage = examResult && examResult.length > limit;
    const displayedExams = examResult ? examResult.slice(0, limit) : [];
    const hasExams = (displayedExams?.length ?? 0) > 0;
  
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-10">All Exams</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hasExams ? (
                    displayedExams.map((exam) => (
                        <ExamCard 
                            key={exam.id}
                            userId={user?.id || ''}
                            examId={exam.id}
                            title={exam.title}
                            description={exam.description}
                            duration={exam.duration}
                            totalMarks={exam.totalMarks}
                            passingMarks={exam.passingMarks}
                            questions={exam.questions}
                            createdAt={exam.createdAt}
                            role={exam.role}
                        />
                    ))
                ) : (
                    <p>You haven&apos;t created any Exam yet</p>
                )}
            </div>
            <div className="mt-12 border-t border-dark-300/50 pt-12">
                <Pagination variant="light" hasNextPage={!!hasNextPage} />
            </div>
        </main>
    );
}

export default page;