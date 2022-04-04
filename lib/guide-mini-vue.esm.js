const publicPropertiesMap = {
    $el: i => i.vnode.el
};
const PublicInstanceProxyHandle = {
    get({ _: instance }, key) {
        // setupState
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        // switch (key) {
        //     case '$el':
        //         return instance.vnode.el
        // }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter)
            return publicGetter(instance);
    }
};

// 创建组件实例
function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()
    // 
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    // ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandle);
    const { setup } = Component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
// 执行
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
// 完成组件初始化
function finishComponentSetup(instance) {
    const Component = instance.type;
    // 如果用户没有写 render 函数 那就吧 实例的 render 赋值
    if (Component.render) {
        instance.render = Component.render;
    }
}

const isObject = val => val && typeof val === 'object';

// 执行render函数 render -> h 根据返回的h进行渲染 dom
function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    // 判断 vnode 是不是一个 element
    // 是element 
    // 处理 element
    if (typeof vnode.type === 'string')
        processElement(vnode, container);
    // 处理 自定义组件
    else if (isObject(vnode.type))
        processComponent(vnode, container);
}
/**
 * 渲染 dom 节点的时候 不是组件
 * ------------------------ dom元素 ------------------------
 */
function processElement(vnode, container) {
    mountElement(vnode, container);
}
// 挂载原生dom
function mountElement(vnode, container) {
    const el = vnode.el = document.createElement(vnode.type);
    // children 有两种类型 string (就是内容 text)     Array (就是有子集 可能是 组件 可能是 dom)
    const { children, props } = vnode;
    // 处理 children
    if (Array.isArray(children))
        mountChildren(children, el);
    else if (typeof children === 'string')
        el.textContent = children;
    // 处理 props
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }
    container.appendChild(el);
}
/**
 * ------------------------ dom元素 ------------------------
 */
/**
 * ------------------------ 渲染组件的时候 ------------------------
 */
function processComponent(vnode, container) {
    // 挂载组件
    mountComponent(vnode, container);
}
// 挂载组件
function mountComponent(vnode, container) {
    // 创建实例
    const instance = createComponentInstance(vnode);
    // 初始化 props slots 等等
    setupComponent(instance);
    // 进行执行 render 函数
    setupRenderEffect(instance, vnode, container);
}
/**
 * ------------------------ 渲染组件的时候 ------------------------
 */
function mountChildren(children, container) {
    for (let index = 0; index < children.length; index++) {
        patch(children[index], container);
    }
}
// s
function setupRenderEffect(instance, vnode, container) {
    const { proxy } = instance;
    // 虚拟节点树
    const subTree = instance.render.call(proxy);
    // vnode -> patch
    // 挂载 element
    // vnode -> element -> mountElement
    patch(subTree, container);
    vnode.el = subTree.el;
}

// 创建虚拟节点
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null
    };
    return vnode;
}

function createApp(rootComponent) {
    // 挂载根节点
    return {
        mount(rootContainer) {
            const container = document.querySelector(rootContainer);
            // 
            // 挂载根节点 创建虚拟DOM
            const vnode = createVNode(rootComponent);
            render(vnode, container);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
