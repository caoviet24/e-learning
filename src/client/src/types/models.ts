export interface IFaculty {
    id: number;
    name: string;
    code: string;
    created_at?: string;
    updated_at?: string;
}

export interface IMajor {
    id: number;
    name: string;
    code: string;
    faculty_id: string;
    is_deleted?: boolean;
    faculty?: IFaculty;
    created_at?: string;
    updated_at?: string;
}

export interface IUser {
    id: string;
    username: string;
    full_name: string;
    email?: string;
    gender?: number;
    avatar?: string;
    phone_number?: string;
    is_deleted?: boolean;
    original_address?: string;
    current_address?: string;
}

export interface ILecturer {
    id: string;
    lecturer_id: string;
    user_id: string;
    faculty_id: string;
    major_id: string;
    user?: IUser;
    faculty?: IFaculty;
    major?: IMajor;
    is_deleted?: boolean;
}