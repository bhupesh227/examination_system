type FormType = "LogIn" | "SignUp" ;

interface SignUpParams{
    uid: string;
    username: string;
    email: string;
    password: string;
}

interface LogInParams{
    email: string;
    idToken: string;
}

interface User {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    authProvider: string;
    avatarURL: string;
    role: string;
}

interface UserInfo{
    id: string;
    username: string;
    role: string;
    avatarURL: string;
}

interface ExamType extends Partial<User>{
    type?: 'teacher' | 'admin';

}
interface ExamFormInfo{
    userId: string;
    title: string;
    description: string;
    duration: number;
    totalMarks: number;
    passingMarks: number;
    questions: Question[];
    role: string;
    
}

interface ExamFormInfoProps{
    id: string;
    userId: string;
    title: string;
    description: string;
    duration: number;
    totalMarks: number;
    passingMarks: number;
    questions: Question[];
    role: string;
    createdAt: string;
}
interface ExamCardProps{
    examId: string;
    userId: string;
    title: string;
    description: string;
    duration: number;
    totalMarks: number;
    passingMarks: number;
    questions: Question[];
    createdAt: string;
    role: string;
}
interface teacherDashboardProps{
    createdExam: ExamFormInfoProps[];
    user : User | null;
}

interface RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
}