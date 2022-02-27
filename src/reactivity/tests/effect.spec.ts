import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
    it("test effect init", () => {
        const user = reactive({
            age: 15
        });
        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        })

        // get
        expect(nextAge).toBe(16);

        // set
        user.age++;
        expect(nextAge).toBe(17);
    });


    it("should return running when call effect", () => {
        let val = 1;
        let runner = effect(() => {
            val++;
            return "f"
        });

        expect(val).toBe(2);

        let returnVal = runner();

        expect(val).toBe(3);
        expect(returnVal).toBe('f');

    });

    it("scheduler", () => {
        // 当第一次使用创建 effect 的时候会执行以下第一个函数
        // 当响应式对象 set update的时候 会执行 第二个参数的 scheduler  但是不糊执行 fn
        // 当手动调用返回的 runner 的时候 会执行 fn
        let dummy;
        let run;
        const scheduler = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({ foo: 1 });
        const runner = effect(() => {
            dummy = obj.foo;
        }, { scheduler });

        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);

        // should be called on first trigger
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);

        // should not run yet
        expect(dummy).toBe(1);

        // manually run
        run();
        // should have run
        expect(dummy).toBe(2);
    });

    it('stop', () => {
        // 增加一个 取消第一个 参数实时响应的方法
        let dummy;
        const obj = reactive({ props: 1 });
        const runner = effect(() => {
            dummy = obj.prop;
        });

        obj.prop = 2;
        expect(dummy).toBe(2);
        stop(runner);
        obj.prop++;
        expect(dummy).toBe(2);

        // stopped effect should still be manually callable
        runner();
        expect(dummy).toBe(3);
    });

    it("onStop", () => {
        // 增加一个 取消第一个实时响应是 触发的回调
        const obj = reactive({
            foo: 1,
        });

        const onStop = jest.fn();

        let dummy;
        const runner = effect(() => {
            dummy = obj.foo;
        }, {
            onStop
        });

        stop(runner);

        expect(dummy).toBe(1);
        expect(onStop).toBeCalledTimes(1);
    });
});