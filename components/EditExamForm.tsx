"use client";
import React, { useState, useEffect } from "react";
import { Form } from "./ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormField from "./FormField";
import { updateExamForm } from "@/lib/actions/exam.action";
import { useRouter } from "next/navigation";

const examSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.coerce.number().min(1, "Duration must be greater than 0"),
  totalMarks: z.coerce.number().min(1, "Total marks must be greater than 0"),
  passingMarks: z.coerce.number().min(1, "Passing marks must be greater than 0"),
  questions: z.array(
    z.object({
      question: z.string().min(1, "Question is required"),
      options: z
        .array(z.string())
        .min(2, "At least two options are required")
        .refine((opts) => new Set(opts).size === opts.length, {
          message: "Options must be unique",
        }),
      answer: z.string().min(1, "Answer is required"),
    }).refine((q) => q.options.includes(q.answer), {
      message: "Answer must be one of the provided options",
      path: ["answer"],
    })
  ),
  role: z.string().optional(),
});

type ExamForm = z.infer<typeof examSchema>;

interface EditExamFormProps {
  examData: (ExamForm & { id: string; userId: string; CurrentRole:string }) | null;
}

const EditExamForm = ({ examData }: EditExamFormProps) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const form = useForm<ExamForm>({
    resolver: zodResolver(examSchema),
    defaultValues: examData || {
      title: "",
      description: "",
      duration: 0,
      totalMarks: 0,
      passingMarks: 0,
      questions: [],
      role: "",
    },
  });

  const { control } = form;
  const { fields, replace,append } = useFieldArray({
    control,
    name: "questions",
  });


  useEffect(() => {
    if (examData) {
      
      form.reset(examData);
      if (examData.questions?.length) {
        replace(examData.questions);
      }
      console.log("Form reset with examData:", examData);
    }
  }, [examData, replace, form]);

  const onSubmit = async (values: ExamForm) => {
    
    if (!examData) {
      toast.error("Exam data not loaded");
      return;
    }
    try {
      setSubmitting(true);
      const updatedData = { userId: examData.userId, ...values, role: values.role || "" };
      const result = await updateExamForm(examData.id, updatedData);
      toast.success(result?.message || "Exam updated successfully");
      router.push(examData.CurrentRole === "teacher" ? "/teacher-dashboard" : "/admin-dashboard");
    } catch (error) {
      toast.error("Failed to update exam");
      console.error("Error updating exam:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < fields.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleAddQuestion = () => {
    const input = window.prompt("How many options for this new question?", "2");
    const num = input ? parseInt(input, 10) : 0;
    if (isNaN(num) || num < 2) {
      toast.error("Please enter a valid number (at least 2).");
      return;
    }
    const newOptions = Array.from({ length: num }, () => "");
    append({ question: "", options: newOptions, answer: "" });
      // jump to the newly added question
    setCurrentQuestionIndex(fields.length);
  };


  function getErrorMessages(errors: any): string[] {
    const messages: string[] = [];
    const traverse = (obj: any) => {
      if (obj?.message) {
        messages.push(obj.message);
      }
      if (typeof obj === "object") {
        Object.values(obj).forEach((value) => traverse(value));
      }
    };
    traverse(errors);
    return messages;
  }

  return (
    <div className="exam-card-border md:w-full py-4 md:ml-8 px-2">
      <h1 className="text-3xl font-bold mb-6">Edit Exam</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            const messages = getErrorMessages(errors);
            messages.forEach((message) => {
                toast.error(message, {
                  description: "Please check your input",
                  duration: 3000,
                });
            });
          })}
          className="w-full space-y-6 mt-4 form"
        >
          <FormField
            control={control}
            name="title"
            label="Exam Title"
            placeholder="Enter exam title"
          />
          <FormField
            control={control}
            name="description"
            label="Exam Description"
            placeholder="Enter exam description"
          />
          <FormField
            control={control}
            name="duration"
            label="Duration (in minutes)"
            placeholder="Enter exam duration"
            type="number"
          />
          <FormField
            control={control}
            name="totalMarks"
            label="Total Marks"
            placeholder="Enter total marks"
            type="number"
          />
          <FormField
            control={control}
            name="passingMarks"
            label="Passing Marks"
            placeholder="Enter passing marks"
            type="number"
          />

          {fields.length > 0 && (
            <>
              <div className="border-b pb-2 mb-4">
                <h2 className="text-2xl font-bold">
                  Question {currentQuestionIndex + 1} of {fields.length}
                </h2>
              </div>
              <FormField
                key={`question-${currentQuestionIndex}`}
                control={control}
                name={`questions.${currentQuestionIndex}.question` as const}
                label="Question"
                placeholder="Enter question text"
              />
              {fields[currentQuestionIndex]?.options.map((_, optionIndex) => (
                <FormField
                  key={`${currentQuestionIndex}-${optionIndex}`}
                  control={control}
                  name={`questions.${currentQuestionIndex}.options.${optionIndex}` as const}
                  label={`Option ${optionIndex + 1}`}
                  placeholder="Enter option text"
                />
              ))}
              <FormField
                key={`answer-${currentQuestionIndex}`}
                control={control}
                name={`questions.${currentQuestionIndex}.answer` as const}
                label="Answer"
                placeholder="Enter correct answer"
              />
                <div className="flex justify-between gap-2 mt-4">
                    <button
                        type="button"
                        className="btn"
                        onClick={goToPrevious}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </button>
                    
                
                    {currentQuestionIndex < fields.length - 1 && (
                        <button
                        type="button"
                        className="btn btn-primary"
                        onClick={goToNext}
                        >
                        Next
                        </button>
                    )}

                    
                    {currentQuestionIndex === fields.length - 1 && (
                        <div className="flex w-full gap-2">
                            <button
                                type="button"
                                className=" btn-addquestion text-dark-200"
                                onClick={handleAddQuestion}
                            >
                                Add Question
                            </button>
                            <button type="submit" className="btn-updateexam text-dark-100" disabled={submitting}>
                                {submitting ? "Submitting..." : "Update Exam"}
                            </button>
                        </div>
                    )}
                </div>
            </>
          )}

          {fields.length === 0 && (
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? "Submitting..." : "Update Exam"}
            </button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default EditExamForm;