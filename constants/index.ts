
export const studentNavItems = [
  { name: "All Exam", link: "/exams" },
  { name: "Generate", link: "/generate" },
  { name: "About", link: "/about" }
];

export const adminNavItems = [
  {name: "Admin Dashboard", link: "/admin-dashboard"},
  { name: "Add Question", link: "/add-question" }
];

export const teacherNavItems = [
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
    route: "/admin-dashboard/GeneratedExams",
  },
]