import { isRef, proxyRefs, ref, unRef } from "../ref";
import { effect } from '../effect';
import { reactive } from '../reactive';

describe("ref", () => {
    it("happy path", () => {
        const a = ref(1);

        // 判断是否返回
        expect(a.value).toBe(1);
    })

    it("should be reactive", () => {
        const a = ref(1);
        let dummy;
        let calls = 0;
        effect(() => {
            calls++;
            dummy = a.value;
        });

        // 判断是否触发了 effect
        expect(calls).toBe(1);
        expect(dummy).toBe(1);

        // 判断是否触发了 effect 并且是先赋值 再出发effect
        a.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);

        // 判断当赋值 同一个的时候 不在重复触发
        a.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);
    })

    it("should make nested properties reactive", () => {
        const a = ref({
            count: 1
        });
        let dummy;
        effect(() => {
            dummy = a.value.count;
        })
        expect(dummy).toBe(1);
        a.value.count = 2;
        expect(dummy).toBe(2);
    })

    it("isRef", () => {
        const a = ref(1);
        const user = reactive({
            age: 1,
        });

        expect(isRef(a)).toBe(true);
        expect(isRef(1)).toBe(false);
        expect(isRef(user)).toBe(false);
    })

    it("unRef", () => {
        const a = ref(1);

        expect(unRef(a)).toBe(1);
        expect(unRef(2)).toBe(2);
    })


    it("proxyRefs", () => {
        const user = {
            age: ref(10),
            name: 'fff'
        };

        const proxyUser = proxyRefs(user);

        expect(user.age.value).toBe(10);
        expect(proxyUser.age).toBe(10);
        expect(proxyUser.name).toBe('fff');

        proxyUser.age = ref(20);
        expect(proxyUser.age).toBe(20);
        expect(user.age.value).toBe(20);

    })
})