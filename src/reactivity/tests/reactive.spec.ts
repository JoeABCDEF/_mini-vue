import { reactive, isReactive, isProxy } from '../reactive';
describe("reactive", () => {
    it("test get set isProxy", () => {
        let original = { val: 1 };
        let reactiveInstance = reactive(original);
        // 首先肯定是两个不相等对象
        expect(original).not.toBe(reactiveInstance);

        // 创建实例后 这俩 a 的值肯定一样
        expect(reactiveInstance.val).toBe(original.val);

        // 测试 isReactive
        expect(isReactive(reactiveInstance)).toBe(true);
        expect(isReactive(original)).toBe(false);

        // 通过相加后 原来的对象的值发生了变化
        reactiveInstance.val++;
        expect(original.val).toBe(2);

        expect(isProxy(reactiveInstance)).toBe(true);
    })

    it('测试嵌套 object 情况', () => {
        const original = {
            nested: {
                foo: 1,
            },
            array: [{ bar: 2 }],
        };

        const observed = reactive(original);
        expect(isReactive(observed.nested)).toBe(true);
        expect(isReactive(observed.array)).toBe(true);
        expect(isReactive(observed.array[0])).toBe(true);
    })
})