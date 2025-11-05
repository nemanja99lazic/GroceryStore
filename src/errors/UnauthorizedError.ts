export class UnauthorizedError {
    private message: string;
    private code: number = 401;
    
    constructor(message: string) {
        this.message = message;
    }

    public getMessage(): string {
        return this.message;
    }

    public getCode(): number{
        return this.code;
    }
}