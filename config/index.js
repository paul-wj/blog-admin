const config = {
	port: 9000,
	database: {
		DATABASE: 'own_blog',
		USERNAME: 'root',
		PASSWORD: 'www5576081',
		PORT: '3306',
		HOST: '118.24.181.75'
	},
	redis: {
		host: '118.24.181.75',       //安装好的redis服务器地址
		port: '6379',       //端口
		prefix: 'test',     //存诸前缀
		ttl: '12',        //过期时间
		db: ''
	}
};
module.exports = config;
