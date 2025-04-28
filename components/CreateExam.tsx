"use client";
import React, { useState } from 'react'
import { Form } from './ui/form'
import { useFieldArray, useForm } from 'react-hook-form';
import {  z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import FormField from './FormField';
import { setExamForm } from '@/lib/actions/exam.action';
import { useRouter } from 'next/navigation';


type ExamForm = z.infer<typeof examSchema>;

const examSchema = z.object({
  title: z.string().min(5, "Title should be greater than 5"),
  description: z.string().min(10, "Description should be greater than 10"),
  duration: z.coerce.number().min(5, "Duration must be greater than 5 minutes"),
  totalMarks: z.coerce.number().min(1, "Total marks must be greater than 0"),
  passingMarks: z.coerce.number().min(1, "Passing marks must be greater than 0"),
  questions: z.array(z.object({
    question: z.string().min(1, "Question is required"),
    options: z.array(z.string()).min(2, "At least two options are required").refine((opts) => new Set(opts).size === opts.length, {
              message: "Options must be unique",
            }),
    answer: z.string().min(1, "Answer is required"),
  }).refine((q) => q.options.includes(q.answer), {
    message: "Answer must be one of the provided options",
    path: ["answer"], 
  })),
  role: z.string().optional(),
});

const CreateExam = ({type,...user}:ExamType) => {
  const [isQuestionsSetup, setIsQuestionsSetup] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [optionsCount, setOptionsCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  
  
  const form = useForm<ExamForm>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 0,
      totalMarks: 0,
      passingMarks: 0,
      questions: [],
      role: type === 'admin' ? 'admin' : 'teacher',
      
    },
  });

  const { control} = form;
  
  const { fields, replace } = useFieldArray({
    control,
    name: "questions",
  });


  const handleSetupQuestions = () => {
    if (questionsCount < 1) {
      toast.error("Enter at least one question");
      return;
    }
    if (optionsCount < 2) {
      toast.error("Each question must have at least two options");
      return;
    }
    // Create an array of questions with UNIQUE IDS
    const generatedQuestions = Array.from({ length: questionsCount }, () => ({
     
      question: "",
      options: Array.from({ length: optionsCount }, () => ""),
      answer: "",
    }));
    replace(generatedQuestions);
    setIsQuestionsSetup(true);
    setCurrentQuestionIndex(0);
  };

  const onSubmit = async (values: ExamForm) => {
    if (submitting) return; // Prevent duplicate submissions
    try {
      setSubmitting(true);
      const result = await setExamForm({
        ...values,
        userId: user?.id ?? "",
        role: type === 'admin' ? 'admin' : 'teacher',
      });
      console.log("Exam created:", values);
      toast.success(result?.message || "Exam created successfully");
      if(type === 'admin'){
        router.push("/admin-dashboard")
      }
      else if(type === 'teacher'){
        router.push("/teacher-dashboard")
      }
    } catch (error) {
      toast.error("Failed to create exam");
      console.error("Error creating exam:", error);
    } finally {
      setSubmitting(false);
    }
  };

 
  const goToPrevious = () => {
    if (isQuestionsSetup && currentQuestionIndex === 0) {
      setIsQuestionsSetup(false);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }    

  const goToNext = () => {
    if (currentQuestionIndex < fields.length - 1){
       setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className='exam-card-border md:w-full py-4 md:ml-8 px-2'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit,(errors)=>{
                    Object.values(errors)
                    .map((error:any)=>error?.message)
                    .filter(Boolean)
                    .forEach((error:string) => {
                        toast.error(error, {
                            description: "Please check your input",
                            duration: 3000,
                        })
                    })
          })} className="w-full space-y-6 mt-4 form"
        >
          {!isQuestionsSetup && (
            <div className="space-y-4">
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

              <div className="space-y-2">
                <label className="block font-semibold">How many questions would you like to add?</label>
                <input 
                  type="number" 
                  className="input"
                  value={questionsCount}
                  onChange={(e) => setQuestionsCount(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <label className="block font-semibold">How many options per question?</label>
                <input 
                  type="number" 
                  className="input"
                  value={optionsCount}
                  onChange={(e) => setOptionsCount(parseInt(e.target.value) || 0)}
                />
              </div>

              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleSetupQuestions}
              >
                Next: Setup Questions
              </button>
            </div>
          )}

          
          {isQuestionsSetup && (
            <div className="space-y-6">
              <div className="border-b pb-2 mb-4">
                <h2 className="text-2xl font-bold">
                  Question {currentQuestionIndex + 1} of {fields.length}
                </h2>
              </div>
              <div className="space-y-4">
                <FormField
                  key={`question-${currentQuestionIndex}`}
                  control={control}
                  name={`questions.${currentQuestionIndex}.question` as const}
                  label="Question"
                  placeholder="Enter question text"
                />
                {fields[currentQuestionIndex].options.map((_, optionIndex) => (
                  <FormField
                    key={`${currentQuestionIndex}-${optionIndex}`}
                    control={control}
                    name={`questions.${currentQuestionIndex}.options.${optionIndex}`}
                    label={`Option ${optionIndex + 1}`}
                    placeholder="Enter option text"
                  />
                ))}
                
                <FormField
                  key={`answer-${currentQuestionIndex}`}
                  control={control}
                  name={`questions.${currentQuestionIndex}.answer`}
                  label="Answer"
                  placeholder="Enter correct answer"
                />
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="btn"
                  onClick={goToPrevious}
                  disabled={currentQuestionIndex === 0 && !isQuestionsSetup}
                >
                  Previous
                </button>
                {currentQuestionIndex < fields.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={goToNext}
                  >
                    Next
                  </button>
                ) : (
                  <button type="submit" className="btn btn-success" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Exam"}
                    
                  </button>
                )}
              </div>
            </div>
          )}
          
        </form>
      </Form>
    </div>
  )
}

export default CreateExam