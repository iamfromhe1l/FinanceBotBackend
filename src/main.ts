import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// global validation pipe
	app.useGlobalPipes(new ValidationPipe());

	app.setGlobalPrefix('api');
	const PORT = process.env.PORT ?? 3002;
	await app.listen(PORT);
	app.enableCors();
}
bootstrap();
