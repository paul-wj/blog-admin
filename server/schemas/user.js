const Joi = require('joi');
const login = Joi.object().keys({
	account: Joi.string().required().error(new Error('账号或密码不能为空')),
	password: Joi.string().required().error(new Error('账号或密码不能为空'))
});
const registerUser = Joi.object().keys({
	email: Joi.string().required().error(new Error('邮箱不能为空')).email().error(new Error('邮箱格式不正确')),
	username: Joi.string().required().error(new Error('用户名不能为空')),
	password: Joi.string().required().error(new Error('密码不能为空')).regex(/^[a-zA-Z0-9]{3,30}$/).error(new Error('密码必须为3-30位字母数字组合')),
	profilePicture: Joi.string()
});

const updateUser = Joi.object().keys({
	email: Joi.string().required().error(new Error('邮箱不能为空')).email().error(new Error('邮箱格式不正确')),
	username: Joi.string(),
	password: Joi.string().required().error(new Error('密码不能为空')).regex(/^[a-zA-Z0-9]{3,30}$/).error(new Error('密码必须为3-30位字母数字组合')),
	oldPassword: Joi.string(),
	profilePicture: Joi.string()
});

module.exports = {
	login,
	registerUser,
	updateUser
};
