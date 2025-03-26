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