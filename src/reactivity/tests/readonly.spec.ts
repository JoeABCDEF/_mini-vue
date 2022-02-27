import { readonly, isReadonly } from '../reactive';

describe("readonly", () => {
    it("init", () => {
        const original = { foo: 1, bar: { baz: 2 } };
        const readonlyInstance = readonly(original);

        expect(readonlyInstance).not.toBe(original);

        // 测试 isReadonly
        expect(isReadonly(readonlyInstance)).toBe(true);
        expect(isReadonly(original)).toBe(false);

        expect(readonlyInstance.foo).toBe(1);
    })
    it("is call ", () => {
        console.warn = jest.fn();
        const wrapped = readonly({ a: 1 });
        wrapped.a = 2;

        expect(console.warn).toBeCalled();
    })
})