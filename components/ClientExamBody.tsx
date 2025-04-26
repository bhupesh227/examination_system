"use client";

import { useEffect, useState } from "react";
import Timer from "./Timer";
import { useRouter } from "next/navigation";

export default function ClientExamBody({
    questions,
    duration,
    userId,
    examId,
    title,      
    description, 
}: {
    questions: any[];
    duration: number;
    userId: string;
    examId: string;
    title: string;
    description: string;
}) {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [index: number]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [examStarted, setExamStarted] = useState(false);
    const router = useRouter();

    const currentQuestion = questions[currentQIndex];
    const selectedAnswer = answers[currentQIndex] || "";

    const handleCloseExam = async () => {
        if (document.fullscreenElement) {
            try {
                await document.exitFullscreen();
            } catch (err) {
                console.warn("Exit fullscreen failed:", err);
            }
        }
        router.push("/AllExams");
    };

    const startExam = async () => {
        try {
            const el = document.documentElement;
            if (el.requestFullscreen) {
                await el.requestFullscreen();
                setExamStarted(true);
            }
        } catch (err) {
            console.error('Fullscreen failed:', err);
            alert('Fullscreen is required to start the exam!');
        }
    };

    useEffect(() => {
        if (!examStarted) return;
        // Security measures
        const disableRightClick = (e: MouseEvent) => {
            e.preventDefault();
            alert('Right-click is disabled during exam!');
        };
        
        const disableKeyCombos = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey || e.metaKey) && 
                ["c", "v", "x", "u", "i"].includes(e.key.toLowerCase())
            ) {
                e.preventDefault();
                alert('This action is not allowed during exam!');
            }
            if (e.key === "F12") {
                e.preventDefault();
                alert('Developer tools are disabled during exam!');
            }
        };

        const onBlur = () => {
            alert("Tab switching or minimizing is not allowed during the exam!");
            window.focus();
        };

        const preventBack = () => {
            history.pushState(null, "", location.href);
        };

        document.addEventListener("contextmenu", disableRightClick);
        document.addEventListener("keydown", disableKeyCombos);
        window.addEventListener("blur", onBlur);
        history.pushState(null, "", location.href);
        window.addEventListener("popstate", preventBack);

        return () => {
            document.removeEventListener("contextmenu", disableRightClick);
            document.removeEventListener("keydown", disableKeyCombos);
            window.removeEventListener("blur", onBlur);
            window.removeEventListener("popstate", preventBack);
        };
    }, [examStarted]);

    if (!examStarted) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-gray-600 mb-4">{description}</p>
                <h2 className="text-2xl font-bold mb-4">Exam Instructions</h2>
                <ul className="text-left list-disc pl-6 mb-6 max-w-md mx-auto">
                    <li>Fullscreen mode is required</li>
                    <li>Right-click is disabled</li>
                    <li>Tab switching will trigger alerts</li>
                    <li>Copy/Paste is disabled</li>
                </ul>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={handleCloseExam}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Close Exam
                    </button>
                    <button
                        onClick={startExam}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Start Exam
                    </button>
                </div>
            </div>
        );
    }

    const handleOptionChange = (option: string) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQIndex]: option,
        }));
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        const submission = questions.map((q: any, idx: number) => {
            const selected = answers[idx] || "";
            return {
                question: q.question,
                selectedAnswer: selected,
                correctAnswer: q.answer,
                isCorrect: selected === q.answer,
            };
        });

        const score = submission.filter((a) => a.isCorrect).length;

        const payload = {
            userId,
            examId,
            answers: submission,
            score,
            submittedAt: new Date().toISOString(),
        };

        await fetch("/api/submit-exam", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        
        if (document.fullscreenElement) {
            try {
              await document.exitFullscreen();
            } catch (err) {
              console.warn("Could not exit fullscreen:", err);
            }
        } // Exit fullscreen

        router.push("/AllExams");
    };

    return (
        <div>
           
            <div className="absolute top-4 right-4">
                <Timer duration={duration} onTimeUp={handleSubmit} />
            </div>
            <div className="bg-white p-6 shadow rounded">
                <p className="font-medium text-lg">
                    Q{currentQIndex + 1}. {currentQuestion.question}
                </p>
                <ul className="mt-4 space-y-2">
                    {currentQuestion.options.map((opt: string, idx: number) => (
                        <li key={idx}>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name={`question-${currentQIndex}`}
                                    checked={selectedAnswer === opt}
                                    onChange={() => handleOptionChange(opt)}
                                />
                                {opt}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => setCurrentQIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={currentQIndex === 0}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Previous
                </button>
                {currentQIndex === questions.length - 1 ? (
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentQIndex((prev) => Math.min(prev + 1, questions.length - 1))}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );

    // Keep your existing handleOptionChange and handleSubmit functions
    // ... (they remain the same)
}