export class BadRequestError {
    private message: string;
    private code: number = 400;
    
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