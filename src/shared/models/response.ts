export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface ErrorResponse extends Error {
    status: number,
    message: string;
    error?: any
    error_code?: string
}