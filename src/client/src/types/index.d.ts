interface JwtPayload {
    id: string;
    role: string;
}

interface IResponse<T> {
    ok: boolean;
    action?: string;
    message: string;
    data?: T;
}

interface IResponseList<T> {
    data: T[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
}

interface IAccount {
    id: string;
    username: string;
    role: string;
    isDeleted?: boolean;
    user: IUser;
}

export interface IUser {
    id: string;
    fullName: string;
    email?: string;
    gender?: number;
    avatar?: string;
    phone?: string;
    currentAddress?: string;
    account: IAccount;
}

export interface IFaculty {
    id: string;
    name: string;
    code: string;
    isDeleted?: boolean;
}

export interface IMajor {
    id: string;
    name: string;
    code: string;
    isDeleted?: boolean;
    faculty?: IFaculty;
}

export interface ILecturer {
    id: string;
    cardId: string;
    position: string;
    status: string;
    joinedAt: Date;
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
    isDeleted?: boolean;
    major: {
        id: string;
        name: string;
        code: string;
        isDeleted?: boolean;
        faculty: IFaculty;
    };
    lecturer?: {
        id: string;
        lecturerId?: string;
        user: IUser;
    };
}


export interface ICourse {
    id: string;
    title: string;
    description: string;
    thumbNail?: string;
    status: string;
    facultyId?: string;
    majorId?: string;
    isDeleted?: boolean;
    author: IUser;
}