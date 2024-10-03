const {customAlphabet} = require('nanoid');
const ShortId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10);
const Crypto = require('node:crypto');
const Jwt = require('jsonwebtoken');

const Utils = {
    /**
     * Function for checking whether the data is empty
     * @param data
     * @returns {boolean}
     */
    isEmpty: (data) => {
        if (data === null || data === undefined) {
            return true;
        }
        if (typeof data === 'string' && data.replace(/ /g, '').length > 0) {
            return false;
        }
        if (typeof data === 'number') {
            return false;
        }
        if (typeof data === 'boolean') {
            return false;
        }
        if (Array.isArray(data) && data.length > 0) {
            return false;
        }
        return !(typeof data === 'object' && Object.keys(data).length > 0);
    },

    getShortId: () => {
        return ShortId();
    },

    generateAuthJwtToken: (data, secret) => {
        return Jwt.sign({
            data
          }, secret, { expiresIn: "7d" });
    },

    verifyAuthJwtToken: (token, secret) => {
        return Jwt.verify(token, secret);
    },

    createPasswordHash: (password) => {
        return Crypto.createHash('md5').update(password).digest("hex");
    },

    responseFormtter: (result) => {
        if (result.error) {
            return {
                success: false,
                message: result.error
            }
        }
        return {
            success: true,
            message: result.message,
            data: result.data
        }
    }

    // /**
    //  * Network Call function
    //  * @param options
    //  */
    // networkCall: async (options) => {
	// 	try {
	// 		let postData = {};

	// 		if (Utils.isEmpty(options.body)) {
	// 			options.body = {};
	// 		}

	// 		if (Utils.isEmpty(options.url)) {
	// 			return {
	// 				error: 'please provide a url',
	// 				body: undefined
	// 			};
	// 		}
	// 		postData['url'] = options.url;

	// 		postData['headers'] = options.headers;
    //         if (Utils.isEmpty(postData.headers)) {
    //             postData.headers['Content-Type'] = 'application/json';
    //         }

	// 		// to decide method for http request
	// 		postData['method'] = options.method || 'GET';

	// 		if (!Utils.isEmpty(options.body)) {
	// 			try {
	// 				postData['body'] = JSON.stringify(options.body);
	// 			} catch (error) {
	// 				return {error: 'unable to stringify body', body: undefined};
	// 			}
	// 		}

	// 		let {url, ...requestData} = postData;
	// 		let response = await fetch(url, requestData);
	// 		return {error: undefined, body: response};
	// 	} catch (error) {
	// 		return {error: error.message || '', body: undefined};
	// 	}
	// }

};

module.exports = Utils;