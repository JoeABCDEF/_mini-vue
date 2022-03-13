import { extend } from "../shared/index";

let activeEffect: ReactiveEffect, shouldTrack;

const effectMaps = new Map();

interface TypeEffectOptions {
    scheduler?: Function;
    onStop?: Function;
}

// https://blog.csdn.net/qq_38277179/article/details/104446592
interface TypeRunner {
    (this: ReactiveEffect | any): any;
    _effect: ReactiveEffect;
}

export class ReactiveEffect {
    private _fn: any;

    // stop 回调
    onStop?: TypeEffectOptions['onStop'];
    deps: Set<ReactiveEffect>[] = [];
    active = true;
    constructor(fn, public scheduler?) {
        this._fn = fn;
    }

    run() {
        if (!this.active) return this._fn();

        shouldTrack = true;

        activeEffect = this;
        const result = this._fn();

        shouldTrack = false;
        return result;
    }

    stop() {
        if (this.active) {
            clearUpEffect(this);
            this.onStop?.();
            this.active = false;
        }
    }
}

// 清除 effect
function clearUpEffect(effectInstance: ReactiveEffect) {
    effectInstance.deps.forEach(dep => dep.delete(effectInstance));
    effectInstance.deps.length = 0;
}

// 依赖收集
export function track(target, key) {
    if (!isTracking()) return;

    let depsMap = effectMaps.get(target);
    if (!depsMap) {
        depsMap = new Map();
        effectMaps.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }

    // if (dep?.includes(dep)) return;
    trackEffects(dep);
}

// 
export function trackEffects(dep) {
    // 之前是否有添加过
    if (dep.has(activeEffect)) return;

    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}

// 判断这个是否应该 进行收集依赖
export function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}

// 触发响应式
export function trigger(target, key) {
    let dep = effectMaps.get(target)?.get(key);
    triggerEffects(dep);
}

export function triggerEffects(dep) {
    if (!dep) return;
    dep.forEach(activeEffect => activeEffect.scheduler ? activeEffect.scheduler?.() : activeEffect.run?.());
}

// 
export function effect(fn, options: TypeEffectOptions = {}): TypeRunner {
    const _effect = new ReactiveEffect(fn, options.scheduler);

    extend(_effect, options)
    // _effect.onStop = options.onStop;

    _effect.run();

    const runner = _effect.run.bind(_effect) as TypeRunner;

    runner._effect = _effect;

    return runner;
}

// 停止响应式
export function stop(runner: TypeRunner) {
    runner._effect.stop();
}