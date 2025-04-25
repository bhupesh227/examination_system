"use client";

import { useEffect, useState } from "react";
import Timer from "./Timer";
import { useRouter } from "next/navigation";

export default function ClientExamBody({
    questions,
    duration,
    userId,
    examId,
}: {
    questions: any[];
    duration: number;
    userId: string;
    examId: string;
}) {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [index: number]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const currentQuestion = questions[currentQIndex];
    const selectedAnswer = answers[currentQIndex] || "";

    useEffect(() => {
        // Fullscreen on mount
        const el = document.documentElement;
        if (el.requestFullscreen) {
            el.requestFullscreen();
        }

        // Disable right-click
        const disableRightClick = (e: MouseEvent) => e.preventDefault();
        document.addEventListener("contextmenu", disableRightClick);

        // Disable copy/paste/inspect
        const disableKeyCombos = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey && ["c", "v", "x", "u"].includes(e.key.toLowerCase())) || // copy, paste, cut, view source
                (e.metaKey && ["c", "v", "x", "u"].includes(e.key.toLowerCase())) ||
                e.key === "F12"
            ) {
                e.preventDefault();
            }
        };
        document.addEventListener("keydown", disableKeyCombos);

        // Detect tab switch or window blur
        const onBlur = () => {
            alert("Tab switching or minimizing is not allowed during the exam!");
        };
        window.addEventListener("blur", onBlur);

        // Prevent back button
        const preventBack = () => {
            history.pushState(null, "", location.href);
        };
        window.addEventListener("popstate", preventBack);
        history.pushState(null, "", location.href); // push once on load

        return () => {
            document.removeEventListener("contextmenu", disableRightClick);
            document.removeEventListener("keydown", disableKeyCombos);
            window.removeEventListener("blur", onBlur);
            window.removeEventListener("popstate", preventBack);
        };
    }, []);

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
            {/* Timer */}
            <div className="absolute top-4 right-4">
                <Timer duration={duration} onTimeUp={handleSubmit}/>
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

            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => setCurrentQIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={currentQIndex === 0}
                >
                    Previous
                </button>
                {currentQIndex === questions.length - 1 ? (
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentQIndex((prev) => Math.min(prev + 1, questions.length - 1))}
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}
