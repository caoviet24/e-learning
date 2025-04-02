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
    role: string;
    user: IUser;
}

export interface IUser {
    id: string;
    full_name: string;
    email?: string;
    gender?: number;
    avatar?: string;
    phone_number?: string;
    is_deleted?: boolean;
    original_address?: string;
    current_address?: string;
    account: IAccount;
}

export interface IFaculty {
    id: string;
    name: string;
    code: string;
    is_deleted?: boolean;
}

export interface IMajor {
    id: string;
    name: string;
    code: string;
    is_deleted?: boolean;
    faculty?: IFaculty;
}

export interface ILecturer {
    id: string;
    lecturer_id?: string;
    user: IUser;
    faculty?: IFaculty;
    major?: IMajor;
}
