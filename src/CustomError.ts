export class CustomError extends Error {
    public code: number;
    public message: string;
    public details: any;

    public constructor(code: number, message: string, details?: any) {
        super(message);
        this.code = code;
        this.message = message;
        this.details = details;
    }
}