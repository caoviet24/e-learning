interface JwtPayload {
    id: string;
    role: string;
    [key: string]: any;
}

interface IResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

interface IResponseList<T> {
    data: T[];
    total_records: number;
    page_number: number;
    page_size: number;
}

interface IAccount {
    id: string;
    username: string;
    email: string;
    role: number;
    user: IUser;
}

interface IFaculty {
    id: string;
    name: string;
    code: string;
}
interface IUser {
    id: string;
    full_name: string;
    avatar: string;
}
