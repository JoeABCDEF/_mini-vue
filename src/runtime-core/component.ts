import { PublicInstanceProxyHandle } from "./componentPublicInstance";

// 创建组件实例
export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    }
    return component;
}

export function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()

    // 
    setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
    const Component = instance.type;

    // ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandle)

    const { setup } = Component;

    if (setup) {
        const setupResult = setup();

        handleSetupResult(instance, setupResult)
    }
}

// 执行
function handleSetupResult(instance: any, setupResult: any) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }

    finishComponentSetup(instance);
}

// 完成组件初始化
function finishComponentSetup(instance: any) {
    const Component = instance.type;

    // 如果用户没有写 render 函数 那就吧 实例的 render 赋值
    if (Component.render) {
        instance.render = Component.render;
    }
}

