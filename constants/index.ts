import { z } from "zod";

export const studentNavItems = [
  {name: "Home ", link: "/"},
  { name: "All Exam", link: "/AllExams" },
  { name: "About Us", link: "/About-Us" }
];

export const adminNavItems = [
  {name: "Home ", link: "/"},
  {name: "Admin Dashboard", link: "/admin-dashboard"},
  { name: "About Us", link: "/About-Us" }
];

export const teacherNavItems = [
  {name: "Home ", link: "/"},
  { name: "Teacher Dashboard", link: "/teacher-dashboard" },
  { name: "About Us", link: "/About-Us" },
];

export const SideBarLinks = [
  {
    text: "Dashboard",
    img: "/icons/dashboard.svg",
    route: "/teacher-dashboard",
  },
  {
    text: "Create Exam",
    img: "/icons/form.svg",
    route: "/teacher-dashboard/create-exams",
  },
  {
    text: "Generated Exams",
    img: "/icons/allexam.svg",
    route: "/teacher-dashboard/GeneratedExams",
  },
  
];

export const AdminSideBarLinks = [
  {
    text: "Admin Dashboard",
    img: "/icons/dashboard.svg",
    route: "/admin-dashboard",
  },
  {
    text: "Create Exam",
    img: "/icons/form.svg",
    route: "/admin-dashboard/create-exams",
  },
  {
    text: "AllGenerated Exams",
    img: "/icons/allexam.svg",
    route: "/admin-dashboard/AllGeneratedExams",
  },
]

export const userExamFeedbackSchema = z.object({
  
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Accuracy"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});