import { reactive, isReactive } from '../reactive';
describe("reactive", () => {
    it("test get set", () => {
        let original = { a: 1 };
        let reactiveInstance = reactive(original);

        // 首先肯定是两个不相等对象
        expect(original).not.toBe(reactiveInstance);

        // 创建实例后 这俩 a 的值肯定一样
        expect(reactiveInstance.a).toBe(original.a);

        // 测试 isReactive
        expect(isReactive(reactiveInstance)).toBe(true);
        expect(isReactive(original)).toBe(false);

        // 通过相加后 原来的对象的值发生了变化
        reactiveInstance.a++;
        expect(original.a).toBe(2);
    })
})