import { mutableHandlers, ReactiveFlags, readonlyHandlers } from './baseHandler';

// 
export function reactive(obj) {
    // : new <ProxyConstructor>(target: any, handler: ProxyHandler<any>) => keyof typeof obj
    return createActiveObject(obj, mutableHandlers);
}

// 
export function readonly(obj) {
    // : new <ProxyConstructor>(target: any, handler: ProxyHandler<any>) => keyof typeof obj
    return createActiveObject(obj, readonlyHandlers);
}

export function isReadonly(obj) {
    return !!obj[ReactiveFlags.IS_READONLY];
}

export function isReactive(obj) {
    return !!obj[ReactiveFlags.IS_REACTIVE];
}

function createActiveObject(obj: any, baseHandlers) {
    return new Proxy(obj, baseHandlers);
}