import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as https from "https";
import * as fs from 'fs';


async function bootstrap() {
	// const privkey = await fs.readFileSync('/app/certs/privkey1.pem', 'utf8');
	// const fullchain  = await fs.readFileSync('/app/certs/fullchain1.pem', 'utf8');
	const app = await NestFactory.create(AppModule);
	const expressApp = app.getHttpAdapter().getInstance();
	// const server = https.createServer({
	//   key: privkey,
	//   cert: fullchain,
	//  },
	//  expressApp,
	// );
	app.useGlobalPipes(new ValidationPipe());
	app.setGlobalPrefix('api');
	const PORT = process.env.PORT ?? 3002;
	app.enableCors();
	await app.listen(PORT);
	// server.listen(443);
}
bootstrap();