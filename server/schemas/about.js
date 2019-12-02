const Joi = require('joi');


const createAboutComment = Joi.object().keys({
	userId: Joi.number().required().error(new Error('请登录后留言!')),
	content: Joi.string().required().error(new Error('留言内容不能为空!')),
});

const createAboutCommentReply = Joi.object().keys({
	userId: Joi.number().required().error(new Error('请登录后回复!')),
	replyType: Joi.number().required().error(new Error('replyType不能为空!')),
	commentId: Joi.number().required().error(new Error('commentId不能为空!')),
	sendId: Joi.number().required().error(new Error('sendId不能为空!')),
	replyId: Joi.when('replyType', {is: 20, then: Joi.number().required().error(new Error('replyId不能为空!'))}),
	content: Joi.string().required().error(new Error('回复内容不能为空!'))
});
module.exports = {
	createAboutComment,
	createAboutCommentReply
};
