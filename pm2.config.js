module.exports = {
	apps: [
		{
			name: 'blog-admin', // 应用名称
			script: './index.js', // 启动文件地址
			cwd: './', // 当前工作路径
			watch: [
				// 监控变化的目录，一旦变化，自动重启
				'config',
				'server',
			],
			ignore_watch: [
				// 忽视这些目录的变化
				'node_modules',
				'logs',
				'init',
			],
			node_args: '--harmony', // node的启动模式
			out_file: './logs/out.log', // 普通日志路径
			error_file: './logs/err.log', // 错误日志路径
			merge_logs: true,
			log_date_format: 'YYYY-MM-DD HH:mm Z',
		},
	],
};
