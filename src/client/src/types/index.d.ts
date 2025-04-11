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
    is_deleted?: boolean;
    user: IUser;
}

export interface IUser {
    id: string;
    full_name: string;
    email?: string;
    gender?: number;
    avatar?: string;
    phone_number?: string;

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
    faculty: {
        id: string;
        name: string;
        code: string;
    };
    major: {
        id: string;
        name: string;
        code: string;
    };
    user: IUser;
}

export interface IClass {
    id: string;
    class_code: string;
    name: string;
    is_deleted?: boolean;
    major: {
        id: string;
        name: string;
        code: string;
        is_deleted?: boolean;
        faculty: IFaculty;
    };
    lecturer?: {
        id: string;
        lecturer_id?: string;
        user: IUser;
    };
}


export interface ICourse {
    
}