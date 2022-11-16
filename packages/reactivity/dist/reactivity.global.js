var VueReactivity = (function (exports) {
    'use strict';

    // 公共方法
    function isObject(target) {
        return typeof target === 'object' && target != null;
    }

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
    const reactiveHandlers = {
        get,
        set,
    };
    const shallowReactiveHandlers = {
        get: shallowget,
        shallowSet,
    };
    const readonlyHandlers = {
        get: readonlyGet,
        set: (target, key, value) => {
            console.log(`set on key is failed`);
        },
    };
    const shallowReadonlyHandlers = {
        get: shallowReadonlyGet,
        set: shallowSet,
    };
    // 方法  (1)只读 (2)深的
    // 柯里化  同一个方法据不同参数来处理逻辑
    //
    // 单词
    // receiver接收器 reflect反射

    function reactive(target) {
        return createReactObj(target, false, reactiveHandlers);
    }
    function shallowReactive(target) {
        return createReactObj(target, false, shallowReactiveHandlers);
    }
    function readonly(target) {
        return createReactObj(target, true, readonlyHandlers);
    }
    function shallowReadonly(target) {
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

    exports.reactive = reactive;
    exports.readonly = readonly;
    exports.shallowReactive = shallowReactive;
    exports.shallowReadonly = shallowReadonly;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
//# sourceMappingURL=reactivity.global.js.map
