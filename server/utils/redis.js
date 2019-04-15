const Redis = require('ioredis');
const redisConfig = require('../../config/index').redis;
const redis = new Redis(redisConfig);
module.exports = redis;

