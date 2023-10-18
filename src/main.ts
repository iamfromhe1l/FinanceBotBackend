import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as https from "https";
import * as fs from 'fs';
import * as process from "process";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.setGlobalPrefix('api');
	app.enableCors();
	const useHTTPS = process.env.RUN_ON_SERVER ?? false;
	if (useHTTPS == "true") {
		const privateKey = fs.readFileSync('/app/certs/privkey1.pem', 'utf8');
		const fullChain = fs.readFileSync('/app/certs/fullchain1.pem', 'utf8');
		const expressApp = app.getHttpAdapter().getInstance();
		const server = https.createServer({
				key: privateKey,
				cert: fullChain,
			},
			expressApp,
		);
		server.listen(443);
	}
	const PORT = process.env.PORT ?? 3002;
	await app.listen(PORT);
}
bootstrap();