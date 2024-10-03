// imports section
const Express = require('express');
const Helmet = require('helmet');
const {isEmpty} = require('./Helpers/Utils');

const App = Express();

// express configurations starting here.
App.use(Express.json());
App.use(Helmet());

/*----------------------------------------------------------------------------*/
// Routes Configurations
App.use('/api/text_to_image/image', require('./Controller/Image/ImageRouter'));
App.use('/api/text_to_image/auth', require('./Controller/Auth/AuthRouter'));
/*----------------------------------------------------------------------------*/

// main error handler middleware for express
App.use((error, request, response, next) => {
    if (!isEmpty(error)) {
        // eslint-disable-next-line no-console
        console.log(error);
        return response?.status(500)?.send({
            success: false,
            message: error?.message || error,
            code: error?.code || 'error'
        });
    }
    next(error);
});

require('./App/Connection').establish(App);
module.exports = App;
