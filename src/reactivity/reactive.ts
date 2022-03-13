import { mutableHandlers, ReactiveFlags, readonlyHandlers, shallowReadonlyHandlers } from './baseHandler';

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

export function shallowReadonly(obj) {
    // : new <ProxyConstructor>(target: any, handler: ProxyHandler<any>) => keyof typeof obj
    return createActiveObject(obj, shallowReadonlyHandlers);
}

export function isReadonly(obj) {
    return !!obj?.[ReactiveFlags.IS_READONLY];
}

export function isReactive(obj) {
    return !!obj?.[ReactiveFlags.IS_REACTIVE];
}


export function isProxy(obj) {
    return isReactive(obj) || isReadonly(obj);
}
function createActiveObject(obj: any, baseHandlers): any {
    return new Proxy(obj, baseHandlers);
}