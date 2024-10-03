const Dotenv = require('dotenv');
Dotenv.config({path: 'Source/App/.env'});
const environment = process.env;

module.exports = {
    PORT: environment.PORT || 6001,
    DB_URL: {
        TEXT_TO_IMAGE: environment.TEXT_TO_IMAGE_DB
    },
    HUGGING_FACE: {
        IMAGE_GENERATE_URL: 'https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image',
        TOKEN: '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'
    },
    AWS: {
        ACCESS_KEY: environment.AWS_ACCESS_KEY,
        SECRET_KEY: environment.AWS_SECRET_KEY,
        S3_BUCKET_NAME: environment.S3_BUCKET_NAME
    },
    JWT_SECRET: environment.JWT_SECRET
};