const {ImageModel} = require('../../Models/UserImageModel');
const {isEmpty, getShortId} = require('../../Helpers/Utils');
const Config = require('../../App/Config');
const AWS = require('aws-sdk');
const axios = require('axios');

// S3 configuration with environment variables
const s3 = new AWS.S3({
    accessKeyId: Config.AWS.ACCESS_KEY,
    secretAccessKey: Config.AWS.SECRET_KEY,
    region: 'ap-south-1'
});

const ImageController = {
    generateImage: async (prompt, user_id) => {
        try {
            let options = {
                url: Config.HUGGING_FACE.IMAGE_GENERATE_URL,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Config.HUGGING_FACE.TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    inputs: prompt
                },
                responseType:'stream'
            }

            let result = await axios(options);

            if (!isEmpty(result.error)) {
                return {error: 'Image generation failed'};
            }
            let imageStream = result.data;

            const params = {
                Bucket: Config.AWS.S3_BUCKET_NAME, 
                Key: `generate/${user_id}_generate_image.jpg`,
                Body: imageStream,
                ContentType: 'image/jpeg'
            };
            
            let uploadProcess = s3.upload(params).promise();

            const uploadUrl = await uploadProcess;

            return {message: 'Image Generated Sccessfully!', data: {url: uploadUrl.Location}};
        } catch (error) {
            console.log(error);
            return {error: 'Something went wrong!'};
        }
    },
    saveImage: async (prompt, user_id) => {
        try {
            let imageId = getShortId();
            let newKey = `${user_id}/${prompt + imageId}`;
            await s3.copyObject({
                Bucket: Config.AWS.S3_BUCKET_NAME,
                CopySource: `${Config.AWS.S3_BUCKET_NAME}/generate/${user_id}_generate_image.jpg`,
                Key: newKey
            }).promise();

            let imageData = {
                user_id,
                prompt,
			    image_id: imageId,
			    image_url: `https://${Config.AWS.S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${newKey}`
            }

            await ImageModel.create(imageData)
            return {messsage: 'Image saved successfully', data: imageData}
        } catch (error) {
            console.log(error);
            return {error: 'Something went wrong!'};
        }
    },

    listImages: async (user_id, query) => {
        try {
            let limit = 20, page = 1;
            if (query.limit) {
                limit = parseInt(query.limit) || 20;
            }
            if (query.page) {
                page = parseInt(query.page) || 1;
            }
            let queryData = {
                user_id
            }
            if (query.prompt) {
                queryData.prompt = {$regex: query.prompt, $options: "i" }
            }

            if (query.date) {
                queryData.createdAt = {$gte: new Date(query.date)}
            }

            let images = await ImageModel.find(queryData, {user_id: 1, prompt: 1, image_id: 1, image_url: 1, createdAt: 1}).skip((page-1)*limit).limit(limit);
            if (isEmpty(images)) {
                return {error: 'User does not have any images'};
            }

            return {message: 'Images', data: images};


        } catch (error) {
            console.log(error);
            return {error: 'Something went wrong!'}; 
        }
    }
};

module.exports = ImageController;