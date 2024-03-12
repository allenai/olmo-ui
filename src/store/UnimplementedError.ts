export class UnimplementedError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'UnimplementedError';
    }
}
