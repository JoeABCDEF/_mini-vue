import { ReactiveEffect } from "./effect";

class ComputeRefImpl {
    // private _getter: any;
    _value: any;
    _dirty: boolean = true;
    private _effect: ReactiveEffect;
    constructor(getter) {
        // this._getter = getter;
        this._effect = new ReactiveEffect(getter, () => {
            !this._dirty && (this._dirty = true)
        });
    }


    public get value(): string {
        if (this._dirty) {
            this._dirty = false;
            this._value = this._effect.run()
        }
        return this._value;
    }

}

export function computed(getter) {
    return new ComputeRefImpl(getter)
};