const Express = require('express');
const Router = Express.Router();
const ImageController = require('./ImageController');
const {check, validationResult} = require('express-validator');
const {responseFormtter} = require('../../Helpers/Utils');
const AuthenticationMiddleware = require('../../Helpers/AuthenticationMiddleware');

Router.use(AuthenticationMiddleware());

Router.post('/generate', [check('prompt', 'Please provide image prompt').trim().notEmpty()],async (request, response) => {
    let userId = request.user.user_id;
    let hasErrors = validationResult(request);
    if (!hasErrors.isEmpty()) {
        return response.status(422).send(responseFormtter({error: hasErrors.errors[0].msg}))
    }
    let result = await ImageController.generateImage(request.body.prompt, userId);
    if (result.error) {
        return response.status(400).send(responseFormtter(result));
    }
    return response.send(responseFormtter(result));
});

Router.post('/save', [check('prompt', 'Please provide image prompt').trim().notEmpty()], async (request, response) => {
    let userId = request.user.user_id;
    let hasErrors = validationResult(request);
    if (!hasErrors.isEmpty()) {
        return response.status(422).send(responseFormtter({error: hasErrors.errors[0].msg}))
    }
    let result = await ImageController.saveImage(request.body.prompt, userId);
    if (result.error) {
        return response.status(400).send(responseFormtter(result));
    }
    return response.send(responseFormtter(result));
});

Router.get('/list', async (request, response) => {
    let userId = request.user.user_id;
    let result = await ImageController.listImages(userId, request.query);
    if (result.error) {
        return response.status(400).send(responseFormtter(result));
    }
    return response.send(responseFormtter(result));
})
module.exports = Router;