// 进行打包 monerpo 获取到需要打包的包
// 1 获取 打包目录
const execa = require('execa'); //最新版本要使用import导入

// 2 进行打包 并行打包
async function build(target) {
    console.log(target, '333');
    // execa  -c执行rollup配置 ，环境变量   //execa开启一个子进程
    await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], { stdio: 'inherit' }); //子进程的输出在父包中输出
}

build('reactivity');
