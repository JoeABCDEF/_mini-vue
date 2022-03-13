import { isReadonly, shallowReadonly } from '../reactive';

describe("shallowReadonly", () => {
    it("shallowReadonly first", () => {
        const props = shallowReadonly({ a: { foo: 1 } });
        expect(isReadonly(props)).toBe(true);
        expect(isReadonly(props.a)).toBe(false);
    });

    it("is call ", () => {
        console.warn = jest.fn();
        const wrapped = shallowReadonly({ a: 1 });
        wrapped.a = 2;

        expect(console.warn).toBeCalled();
    })
});