const {check} = require('express-validator');

const AuthValidator = {
    signUpVaidator: [
        check('email', 'Please provide email').trim().notEmpty().isEmail().withMessage('Please provide valid email'),
        check('password', 'Please provide passowrd').trim().notEmpty().custom((value) => {
            if(value.length < 8) {
                return false;
            }
            return true;
        }).withMessage('Password should have atleast 8 characters!'),
        check('name').trim().optional({nullable: true})
    ],

    signInValidator: [
        check('email', 'Please provide email').trim().notEmpty().isEmail().withMessage('Please provide valid email'),
        check('password', 'Please provide passowrd').trim().notEmpty().custom((value) => {
            if(value.length < 8) {
                return false;
            }
            return true;
        }).withMessage('Password should have atleast 8 characters!')
    ]
};

module.exports = AuthValidator