import { readonly, isReadonly, isProxy } from '../reactive';

describe("readonly", () => {
    it("test get set nest isProxy", () => {
        const original = { foo: 1, bar: { baz: 2 } };
        const readonlyInstance = readonly(original);

        expect(readonlyInstance).not.toBe(original);

        // 测试 isReadonly
        expect(isReadonly(readonlyInstance)).toBe(true);
        expect(isReadonly(original)).toBe(false);
        expect(isReadonly(readonlyInstance.bar)).toBe(true);

        expect(readonlyInstance.foo).toBe(1);
        expect(isProxy(readonlyInstance)).toBe(true);
    })
    it("is call ", () => {
        console.warn = jest.fn();
        const wrapped = readonly({ a: 1 });
        wrapped.a = 2;

        expect(console.warn).toBeCalled();
    })
})