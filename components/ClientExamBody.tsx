"use client";

import { useEffect, useRef, useState } from "react";
import Timer from "./Timer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    const [showFsWarning, setShowFsWarning] = useState(false);
    const cheatAttemptsRef = useRef(0);
    const router = useRouter();

    const currentQuestion = questions[currentQIndex];
    const selectedAnswer = answers[currentQIndex] || "";

    const handleMalpractice = (
        warningMessage: string,
        submitMessage: string
    ) => {
        cheatAttemptsRef.current += 1;

        if (cheatAttemptsRef.current > 1) {
        handleSubmit(submitMessage);
        } else {
        toast.warning(warningMessage);
        window.focus();
        }
    };

    const handleCloseExam = async () => {
        if (document.fullscreenElement) {
        try { await document.exitFullscreen(); }
        catch (err) { console.warn("Exit fullscreen failed:", err); }
        }
        router.push("/AllExams");
    };

    const startExam = async () => {
        try {
        await document.documentElement.requestFullscreen();
        setExamStarted(true);
        } catch (err) {
        console.error("Fullscreen failed:", err);
        alert("Fullscreen is required to start the exam!");
        }
    };

    useEffect(() => {
        if (!examStarted) return;

        // 1) Disable right-click
        const disableRightClick = (e: MouseEvent) => {
            e.preventDefault();
            handleMalpractice(
            "Right-click disabled! First warning.",
            "Exam submitted due to right-click attempt!"
            );
        };
        // 2) Disable copy/paste/dev-tools
        const disableKeyCombos = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();
            if ((e.ctrlKey || e.metaKey) && ["c","v","x","u","i"].includes(k)) {
                e.preventDefault();
                handleMalpractice(
                "Copy/Paste disabled! First warning.",
                "Exam submitted due to copy/paste attempt!" 
                );
            }
            if (e.key === "F12") {
                e.preventDefault();
                handleMalpractice(
                "Developer tools disabled! First warning.",
                "Exam submitted due to dev tools attempt!"
                );
            }
        };
        // 3) Tab-switch detection
        const onVisibilityChange = () => {
            if (document.hidden) {
                handleMalpractice(
                "Tab switching detected! First warning.",
                "Exam submitted due to tab switching!"
                );
            }
        };
        // 4) Fullscreen exit detection
        const onFullscreenChange = () => {
            if (examStarted && !document.fullscreenElement) {
                if (cheatAttemptsRef.current === 0) {
                
                cheatAttemptsRef.current = 1;
                setShowFsWarning(true);
                } else {
                handleSubmit("Exam submitted due to multiple fullscreen exits!");
                }
            }
        };
        // 5) Prevent back navigation
        const preventBack = () => { history.pushState(null, "", location.href); };

        document.addEventListener("contextmenu", disableRightClick);
        document.addEventListener("keydown", disableKeyCombos);
        document.addEventListener("visibilitychange", onVisibilityChange);
        document.addEventListener("fullscreenchange", onFullscreenChange);
        history.pushState(null, "", location.href);
        window.addEventListener("popstate", preventBack);

        return () => {
        document.removeEventListener("contextmenu", disableRightClick);
        document.removeEventListener("keydown", disableKeyCombos);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        document.removeEventListener("fullscreenchange", onFullscreenChange);
        window.removeEventListener("popstate", preventBack);
        };
    }, [examStarted]);


    const handleOptionChange = (option: string) => {
        setAnswers(prev => ({ ...prev, [currentQIndex]: option }));
    };


    const handleSubmit = async (warningMessage?: string) => {
        if (isSubmitting) return;
            setIsSubmitting(true);

        if (warningMessage) {
            toast.warning(warningMessage);
        }
        if (cheatAttemptsRef.current > 1) {
            alert("Exam submitted due to multiple malpractice attempts!");
        }

        const submission = questions.map((q, idx) => ({
            question: q.question,
            selectedAnswer: answers[idx] || "",
            correctAnswer: q.answer,
            isCorrect: (answers[idx] || "") === q.answer,
        }));
        const score = submission.filter(a => a.isCorrect).length;

        await fetch("/api/submit-exam", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                examId,
                answers: submission,
                score,
                submittedAt: new Date().toISOString(),
            }),
        });

        if (document.fullscreenElement) {
            document.exitFullscreen().catch(console.warn);
        }
            router.push("/AllExams");
    };

  
    if (showFsWarning) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-white p-4 z-50">
                <h2 className="text-2xl mb-4">You exited fullscreen!</h2>
                <p className="mb-6">Please click below to continue in fullscreen.</p>
                <button
                onClick={async () => {
                    setShowFsWarning(false);
                    try {
                    await document.documentElement.requestFullscreen();
                    } catch (err) {
                    console.error("Re-enter fullscreen failed:", err);
                    alert("Unable to re-enter fullscreen. Exam will be submitted.");
                    handleSubmit("Exam submitted due to fullscreen re-entry failure!");
                    }
                }}
                className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                    Re-enter Fullscreen
                </button>
            </div>
        );
    }

    if (!examStarted) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-3xl font-extrabold text-orange-300">{title}</h1>
                <p className="text-gray-700 mb-4">{description}</p>
                <div className="bg-white p-6 shadow rounded mb-4">
                    <h2 className="text-2xl font-bold mb-4">Exam Instructions:-</h2>
                    <ul className="text-center list-outside list-disc pl-6 mb-6 mx-auto max-w-md">
                        <li className="list">Fullscreen mode is required</li>
                        <li className="list">Right-click is disabled</li>
                        <li className="list">Tab switching will trigger alerts</li>
                        <li className="list">Copy/Paste is disabled</li>
                        <li className="list">Each user has only one attempt; if cheating is detected more than once, the system will automatically submit the exam.</li>
                    </ul>
                </div>
                <div className="flex gap-4 justify-center">
                <button
                    onClick={handleCloseExam}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 cursor-pointer"
                >
                    Close Exam
                </button>
                <button
                    onClick={startExam}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                    Start Exam
                </button>
                </div>
            </div>
        );
    }

  return (
    <div>
      <div className="absolute top-4 right-4">
        <Timer duration={duration} onTimeUp={() => handleSubmit()} />
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
          onClick={() => setCurrentQIndex(p => Math.max(p - 1, 0))}
          disabled={currentQIndex === 0}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
            Previous
        </button>
        {currentQIndex === questions.length - 1 ? (
          <button
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentQIndex(p => Math.min(p + 1, questions.length - 1))
            }
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
                Next
          </button>
        )}
      </div>
    </div>
  );
}
