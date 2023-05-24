import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
	(data: string | undefined, context: ExecutionContext): string => {
		const request = context.switchToHttp().getRequest();
		if (!data) return request.data;
		return request.user[data];
	},
);
