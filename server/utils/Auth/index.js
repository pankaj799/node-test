require('../../db_functions');
let md5 = require("md5");
let moment = require("moment");
let Auth = require('../../models/Auth');
let ObjectId = require('mongodb').ObjectID;
var Messages = require("./messages");
let jwt = require('jsonwebtoken');
let helpers = require('../../services/helper')

const AuthUtils = {

    register: async (data) => {
        let { email, password, name } = data;
        let queryObject = { email, status: { $ne: 2 } }
        let checkEmailExistance = await getSingleData(Auth, queryObject, '')
        if (checkEmailExistance.status) {
            return helpers.showResponse(false, Messages.REGISTER_FAILED, null, null, 200);
        }
        // if new email
        let newObj = {
            email,
            password: md5(password),
            name,
            created_on: moment().unix()
        }
        let authRef = new Auth(newObj)
        let result = await postData(authRef);
        if (result.status) {
            return helpers.showResponse(true, Messages.REGISTER_SUCCESS, null, null, 200);
        }
        return helpers.showResponse(false, Messages.REGISTER_FAILED, null, null, 200);
    },

    login: async (data) => {
        let { email, password } = data;
        let queryObject = {
            email: email,
            password: md5(password),
            status: { $eq: 1 },
        }
        let result = await getSingleData(Auth, queryObject, '-password');
        if (result.status) {
            let token = jwt.sign({ user_id: result.data._id }, process.env.API_SECRET, {
                expiresIn: process.env.JWT_EXPIRY
            });
            let resp = { token, time: process.env.JWT_EXPIRY };
            return helpers.showResponse(true, Messages.LOGIN_SUCCESS, resp, null, 200);
        }
        return helpers.showResponse(false, Messages.LOGIN_FAILED, null, null, 200);
    },

    update: async (data) => {
        let result = await updateData(Auth, data, ObjectId(data.user_id))
        if (result.status) {
            return helpers.showResponse(true, "Data Updated Scuuessfully", null, null, 200);
        }
        return helpers.showResponse(false, "Unable to update Date", null, null, 200);
    },

    getAuthUserDetail: async (_id) => {
        let result = await getSingleData(Auth, { _id: ObjectId(_id) }, '');
        if (!result.status) {
            return helpers.showResponse(false, "Invalid User Identifier", null, null, 200);
        }
        return helpers.showResponse(true, "Here Is A User Detail", result.data, null, 200);
    },

    logout: async (data) => {
        let { user_id } = data
        let result = await getSingleData(Auth, { _id: ObjectId(user_id) }, '');
        if (!result.status) {
            return helpers.showResponse(false, Messages.INVALID_USER_ID, null, null, 200);
        }
        let userData = result.data
        let response = await updateData(Auth, editObj, ObjectId(user_id));
        if (response.status) {
            return helpers.showResponse(true, "Logout Success", null, null, 200);
        }
        return helpers.showResponse(false, "Unable to logout at the moment", null, null, 200);
    }
}

module.exports = {
    ...AuthUtils
}