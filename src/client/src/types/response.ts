export interface IResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export interface IResponseList<T> {
    data: T[];
    total_records: number;
    page_number: number;
    page_size: number;
}