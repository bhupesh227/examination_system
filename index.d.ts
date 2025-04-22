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