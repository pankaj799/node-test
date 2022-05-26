const API_SECRET = process.env.API_SECRET;
let jwt = require('jsonwebtoken');
var helpers = require('../services/helper')
let Auth = require('../utils/Auth');

const middleware = {
    checkToken: async (req, res, next) => {
        let token = req.headers['access_token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (!token) {
            return res.status(401).json({ status: false, message: "Something went wrong with token" });
        }
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        if (token) {
            jwt.verify(token, API_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ status: false, message: "Something went wrong with token" });
                }
                let user_id = decoded.user_id;
                let response = await Auth.getAuthUserDetail(user_id);
                if (!response.status) {
                    return res.status(451).json({ status: false, message: "Your Account has been deleted by admin !!! Please register again" });
                }
                if (!response.data.status) {
                    return res.status(423).json({ status: false, message: "Your account login has been disabled by admin !!! Please contact administrator" });
                }
                req.decoded = decoded;
                req.token = token
                next();
            });
        } else {
            return res.status(401).json({ status: false, message: "Something went wrong with token" });
        }
    },
    
    refreshToken: async (req, res) => {
        let requiredFields = ['type', '_id'];
        let validator = helpers.validateParams(req, requiredFields);
        if (!validator.status) {
            response = helpers.showResponse(false, validator.message)
            return res.status(203).json(response);
        }
        let { type, _id } = req.body
		if (type === "auth") {
            let result = await Auth.getAuthUserDetail(_id);
			if (!result.status) {
				return res.status(403).json(helpers.showResponse(false, "Invalid User"));
			}
			let userData = result.data;
			if (userData.status == 0) {
				return res.status(451).json(helpers.showResponse(false, "Your account login has been disabled by admin !!! Please contact administrator"));
			}
			if (userData.status == 2) {
				return res.status(423).json(helpers.showResponse(false, "Your Account has been deleted by admin !!! Please register again"));
			}
			let token = jwt.sign({ user_id: _id }, API_SECRET, {
				expiresIn: process.env.JWT_EXPIRY
			});
			data = { token: token, time: process.env.JWT_EXPIRY };
			return res.status(200).json(helpers.showResponse(true, "New Token", data));
		} else  {
			return res.status(401).json(helpers.showResponse(false, "Invalid User Type"));
		}
    }    
}

module.exports = {
    ...middleware
}