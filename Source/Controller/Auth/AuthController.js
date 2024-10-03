const Config = require('../../App/Config');
const { isEmpty, getShortId, createPasswordHash, generateAuthJwtToken, verifyAuthJwtToken } = require('../../Helpers/Utils');
const {UserModel} = require('../../Models/UserImageModel');

const AuthController = {
    signupUser: async (signUpData) => {
        try {
            let existingEmail = await UserModel.findOne({'email.id':signUpData.email}).lean();
            if(!isEmpty(existingEmail)) {
                return {error: 'User Email already registered! Please sign in!'};
            }
            let createUserData = {
                user_id: getShortId(),
                email: {
                    id: signUpData.email
                },
                password: createPasswordHash(signUpData.password),
                name: signUpData.name || 'USER'
            };

            let user = await UserModel.create(createUserData);

            return {message: 'User registered successfully! Please sign in', data: {
                user_id: user.user_id,
                status: user.status,
                name: user.name,
                email: user.email.id
            }};
        } catch (error) {
            console.log(error);
            return {error: 'Something went wrong!'}
        }
    },

    logIn: async (logInData) => {
        try {
            let existingUser = await UserModel.findOne({'email.id':logInData.email});
            if(isEmpty(existingUser)) {
                return {error: 'Email not registered!'};
            }
            let hashedPassword = createPasswordHash(logInData.password);
            if (hashedPassword !== existingUser.password) {
                return {error: 'Please check the password'};
            }

            if (existingUser.status === 'inactive') {
                return {error: 'User Account deactivated. Please contact support team!'};
            }
            
            let token = generateAuthJwtToken(`${existingUser.user_id}:${existingUser.password}`, Config.JWT_SECRET);

            if (isEmpty(token)) {
                return {error: 'Something went wrong while signing in!'};
            }

            return {message: 'Signed In Successfully!', data: {token}}
        } catch (error) {
            console.log(error);
            return {error: 'Something went wrong!'};
        }
    }
};

module.exports = AuthController;