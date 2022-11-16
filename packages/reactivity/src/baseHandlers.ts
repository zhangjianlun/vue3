import { isObject } from '@vue/shared';
import { reactive, readonly } from './reactive';

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        // proxy + reflect
        const res = Reflect.get(target, key, receiver); // target[key] 代理
        // 判断
        if (!isReadonly) {
            return; //依赖收集 effect相当于watcher
        }
        if (shallow) {
            return res; //浅 仅对第一层代理
        }
        // key 是一个对象 递归  vue3  懒代理state.list
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res); //递归
        }
        return res;
    };
}
const get = createGetter();
const shallowget = createGetter(false, true);
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createSetter(shallow = false) {
    return function (target, key, value, receiver) {
        const res = Reflect.set(target, key, value, receiver); //获取最新的值
        // 触发更新

        return res;
    };
}
const set = createSetter();
const shallowSet = createSetter(true);
export const reactiveHandlers = {
    get,
    set,
};
export const shallowReactiveHandlers = {
    get: shallowget,
    shallowSet,
};
export const readonlyHandlers = {
    get: readonlyGet,
    set: (target, key, value) => {
        console.log(`set on key is failed`);
    },
};
export const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set: shallowSet,
};
// 方法  (1)只读 (2)深的
// 柯里化  同一个方法据不同参数来处理逻辑
//

// 单词
// receiver接收器 reflect反射
