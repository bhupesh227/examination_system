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