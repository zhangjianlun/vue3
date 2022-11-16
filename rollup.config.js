//获取打包文件
// 1 引入相关依赖
import ts from 'rollup-plugin-typescript2'; //解析ts
import json from '@rollup/plugin-json';
import resolvePlugin from '@rollup/plugin-node-resolve'; //解析第三方插件
import path from 'path';
// 2 获取文件路径
let packagesDir = path.resolve(__dirname, 'packages'); //获取绝对路径
// 2.1获取需要打包的包
let packageDir = path.resolve(packagesDir, process.env.TARGET);
// 2.2打包获取到 每个包的项目配置
const resolve = p => path.resolve(packageDir, p);
const pkg = require(resolve(`package.json`)); //获取json
const packageOptions = pkg.buildOptions || {};
const name = packageOptions.filename || path.basename(packageDir); //拿到包名

// 创建一张表
const outputOptions = {
    'esm-bundler': {
        file: resolve(`dist/${name}.esm.bundler.js`),
        format: 'es',
    },
    cjs: {
        file: resolve(`dist/${name}.cjs.js`),
        format: 'cjs',
    },
    global: {
        file: resolve(`dist/${name}.global.js`),
        format: 'iife',
    },
};
function createConfig(format, output) {
    output.name = packageOptions.name;
    output.sourcemap = true;
    // 生成rollup配置
    return {
        input: resolve('src/index.ts'),
        output,
        plugins: [json(), ts({ tsconfig: path.resolve(__dirname, 'tsconfig.json') }), resolvePlugin()],
    };
}
// rollup需要导出一个配置
export default packageOptions.formats.map(format => createConfig(format, outputOptions[format]));
