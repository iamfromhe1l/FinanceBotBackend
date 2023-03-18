import { ConfigService } from '@nestjs/config';

export const getMongoConfig = (
	configService: ConfigService,
): Record<string, boolean | string> => {
	return {
		uri: getMongoURI(configService),
		...getMongoOptions(),
	};
};

export const getMongoURI = (configService: ConfigService): string => {
	return (
		'mongodb+srv://' +
		configService.get('MONGO_USERNAME') +
		':' +
		configService.get('MONGO_PASSWORD') +
		'@cluster0.kgjnvpn.mongodb.net/api'
	);
};

const getMongoOptions = (): Record<string, boolean> => ({
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});
