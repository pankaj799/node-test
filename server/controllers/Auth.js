var Auth = require('../utils/Auth');
var ControllerMessages = require("./controllerMessages");
var helpers = require('../services/helper')



const authController = {

    register: async (req, res) => {
        let requiredFields = ['email', 'password', 'name'];
        let validator = helpers.validateParams(req, requiredFields);
        if (!validator.status) {
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let result = await Auth.register(req.body);
        return helpers.showOutput(res, result, result.code);
    },

    login: async (req, res) => {
        let requiredFields = ['email', 'password'];
        let validator = helpers.validateParams(req, requiredFields);
        if (!validator.status) {
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let result = await Auth.login(req.body);
        return helpers.showOutput(res, result, result.code);
    },

    update: async (req, res) => {
        let user_id = req.decoded.user_id;
        if (!user_id) {
            return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.INVALID_USER), 403);
        }
        req.body = { ...req.body, user_id}
        let result = await Auth.update(req.body);
        return helpers.showOutput(res, result, result.code);
    },

    logout: async (req, res) => {
        let user_id = req.decoded.user_id;
        if (!user_id) {
            return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.INVALID_USER), 403);
        }
        let result = await Auth.logout({user_id});
        return helpers.showOutput(res, result, result.code);
    },
}

module.exports = {
    ...authController
}