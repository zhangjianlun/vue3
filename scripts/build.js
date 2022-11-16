// 进行打包 monerpo 获取到需要打包的包
// 1 获取 打包目录
const fs = require('fs');
const execa = require('execa'); //最新版本要使用import导入

const dirs = fs.readdirSync('packages').filter(p => {
    if (!fs.statSync(`packages/${p}`).isDirectory()) {
        return false;
    }
    return true;
});
// 2 进行打包 并行打包
async function build(target) {
    console.log(target, '333');
    // execa  -c执行rollup配置 ，环境变量   //execa开启一个子进程
    await execa('rollup', ['-c', '--environment', `TARGET:${target}`], { stdio: 'inherit' }); //子进程的输出在父包中输出
}

async function runParaller(dirs, itemfn) {
    let result = [];
    for (const item of dirs) {
        result.push(itemfn(item));
    }
    return Promise.all(result); //存放打包后的promise，等待打包执行完毕之后，调用成功
}

runParaller(dirs, build).then(() => {
    // console.log('打包完成');
});
// console.log(dirs);
