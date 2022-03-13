import { isObject } from "./../shared";
import { track, trigger } from "./effect";
import { readonly, reactive } from './reactive';
import { extend } from '../shared/index';

export enum ReactiveFlags {
    IS_REACTIVE = "__Is_Reactive",
    IS_READONLY = "__Is_Readonly"
}

const get = createGetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const set = createSetter();


function createGetter(isReadonly = false, isShallow = false) {
    return function get(target, key, receiver) {
        switch (key) {
            case ReactiveFlags.IS_REACTIVE:
                return !isReadonly;
            case ReactiveFlags.IS_READONLY:
                return isReadonly;
        }


        let val = Reflect.get(target, key);

        if (isShallow) return val;

        if (isObject(val)) return isReadonly ? readonly(val) : reactive(val);

        !isReadonly && track(target, key);

        return val;
    }
}

function createSetter() {
    return function set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver);

        // 在触发 set 的时候进行触发依赖
        trigger(target, key);

        return result;
    };
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
        // readonly 的响应式对象不可以修改值
        console.warn(
            `Set operation on key "${String(key)}" failed: target is readonly.`,
            target
        );

        return true;
    },
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
})

export const mutableHandlers = {
    get,
    set,
};