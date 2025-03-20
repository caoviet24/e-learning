interface JwtPayload {
    id: string;
    role: number;
    [key: string]: any;
}

interface IAccount {
    id: string;
    username: string;
    email: string;
    role: number;
    user: IUser
}

interface IUser {
    id: string;
    full_name: string;
    avatar: string;
}