const {responseFormtter, isEmpty, verifyAuthJwtToken} = require('./Utils');
const Config = require('../App/Config');
const {UserModel} = require('../Models/UserImageModel');

const AuthenticationMiddleware = () => {
    return async (request, response, next) => {
        try {
            if (isEmpty(request.headers['authorization'])) {
                return response.status(401).send(responseFormtter({error: 'Unauthorized Access!'}));
            }
            let token = request.headers['authorization'].split(' ')[1];
            let verifiedToken = verifyAuthJwtToken(token, Config.JWT_SECRET);

            let userId = verifiedToken.data.split(':')[0];

            let userVerification = await UserModel.findOne({user_id: userId}).lean();

            if (isEmpty(userVerification) || userVerification.status === 'inactive') {
                return response.status(401).send(responseFormtter({error: 'User Not Found! or User inactive!'}));
            }

            request.user = {
                user_id: userId
            }
            
            return next();
        } catch (error) {
            console.log(error);
            return response.status(400).send(responseFormtter({error: 'Something went wrong!'}));
        }
    }
};

module.exports = AuthenticationMiddleware;