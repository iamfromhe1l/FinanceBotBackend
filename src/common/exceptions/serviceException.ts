import { HttpException, HttpStatus } from '@nestjs/common';

export class ServiceException extends HttpException {
    constructor(message: string) {
        super({ error: message }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
