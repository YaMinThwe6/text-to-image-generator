const Express = require('express');
const Router = Express.Router();
const {signUpVaidator, signInValidator} = require('./AuthValidator');
const {validationResult} = require('express-validator');
const {responseFormtter} = require('../../Helpers/Utils');
const AuthController = require('./AuthController');

Router.post('/user/sign-up', signUpVaidator, async (request, response) => {
    let hasErrors = validationResult(request);
    if (!hasErrors.isEmpty()) {
        return response.status(422).send(responseFormtter({error: hasErrors.errors[0].msg}));
    }

    let result = await AuthController.signupUser(request.body);
    if (result.error) {
        return response.status(400).send(responseFormtter(result));
    }
    return response.send(responseFormtter(result));
});

Router.post('/user/sign-in', signInValidator, async (request,response) => {
    let hasErrors = validationResult(request);
    if (!hasErrors.isEmpty()) {
        return response.status(422).send(responseFormtter({error: hasErrors.errors[0].msg}));
    }

    let result = await AuthController.logIn(request.body);
    if (result.error) {
        return response.status(400).send(responseFormtter(result));
    }
    return response.send(responseFormtter(result));
});

module.exports = Router;