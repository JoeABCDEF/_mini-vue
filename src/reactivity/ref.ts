import { hasChanged } from "../shared";
import { trackEffects, isTracking, triggerEffects } from "./effect";
import { isObject } from '../shared/index';
import { reactive } from './reactive';

class RefImpl {
    private _value: any;
    public dep: any;
    private _rawValue: any;
    public __v_ref = true;
    constructor(value) {
        // 因为  下方转化了reactive 所以 this.value 不是初始值 所以需要在声明一个变量来 保存初始值
        this._rawValue = value
        //  如果是普通的值 就 直接赋值 如果 对象 就还是转换成 reactive
        this._value = convert(value);

        this.dep = new Set();
    }

    get value() {
        trackRefValue(this);

        return this._value;
    }

    set value(value) {
        if (!hasChanged(this._rawValue, value)) return;

        this._rawValue = value;
        this._value = convert(value);

        triggerEffects(this.dep);
    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
    if (isTracking()) trackEffects(ref.dep);
}

export function ref(value) {
    return new RefImpl(value);
}

export function isRef(ref) {
    return !!ref?.__v_ref;
}


export function unRef(ref) {
    return ref?.__v_ref ? ref.value : ref;
}

export function proxyRefs(value) {
    return new Proxy(value, {
        get(target, key) {
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) return target[key].value = value
            else return Reflect.set(target, key, value);
            // return false;
        }
    })
}