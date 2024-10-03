const DBConnection = require('../App/Connection');
const TextToImageDataBase = DBConnection.getTextToImageDBConnection();
const Timestamps = require('mongoose-timestamp');

const UserSchema = new TextToImageDataBase.Schema({
	user_id: {type: String, unique: true},
	status: {type: String, enum: ['active', 'inactive'], default: 'active'},
	name: {type: String, default: 'USER'},
	email: {
		id: {type: String, default: ''},
		is_verified: {type: Boolean, default: false}
	},
	password: {type: String},
	token: {
		secret: {type: String},
	},
	verification_code: {
		phone: String
	}
});

UserSchema.plugin(Timestamps);

const UserModel = TextToImageDataBase.model('users', UserSchema);

const ImageSchema = new TextToImageDataBase.Schema({
    user_id: {type: String},
    prompt: {type: String},
	image_id: {type: String},
    image_url: {type: String}
});

ImageSchema.plugin(Timestamps);

const ImageModel = TextToImageDataBase.model('images', ImageSchema);
module.exports = {UserModel, ImageModel};
