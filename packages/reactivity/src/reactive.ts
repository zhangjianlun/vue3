import { isObject } from '@vue/shared';
import { reactiveHandlers, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHandlers } from './baseHandlers';

export function reactive(target) {
    return createReactObj(target, false, reactiveHandlers);
}
export function shallowReactive(target) {
    return createReactObj(target, false, shallowReactiveHandlers);
}
export function readonly(target) {
    return createReactObj(target, true, readonlyHandlers);
}
export function shallowReadonly(target) {
    return createReactObj(target, true, shallowReadonlyHandlers);
}
// TODO 实现代理
const reactiveMap = new WeakMap(); //key 必须是对象 自动的垃圾回收
const readonlyMap = new WeakMap();
function createReactObj(target, isReadOnly, baseHandlers) {
    if (!isObject(target)) {
        return target;
    }
    // 优化
    const proxymap = isReadOnly ? readonlyMap : reactiveMap;
    const proxyEs = proxymap.get(target); //有
    if (proxyEs) {
        return proxyEs;
    }
    const proxy = new Proxy(target, baseHandlers); //baseHandlers 处理 各自的细节 {get,  set} 
    proxymap.set(target, proxy); //存放
    return proxy;
}
// 4个方法  (1)是不是只读 (2)是不是深  {list:{}}
// 注意  核心 proxy 源码中  柯里化： 根据不同的参数  proxy(target,{})
// 被代理的数据 优化 不再处理
