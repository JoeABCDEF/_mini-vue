import { createComponentInstance, setupComponent } from "./component";
import { isObject } from '../shared/index';

// 执行render函数 render -> h 根据返回的h进行渲染 dom
export function render(vnode, container) {
    patch(vnode, container);
}

function patch(vnode, container) {
    // 判断 vnode 是不是一个 element
    // 是element 

    // 处理 element
    if (typeof vnode.type === 'string') processElement(vnode, container);

    // 处理 自定义组件
    else if (isObject(vnode.type)) processComponent(vnode, container);
}

/**
 * 渲染 dom 节点的时候 不是组件
 * ------------------------ dom元素 ------------------------
 */
function processElement(vnode, container) {
    mountElement(vnode, container);
}

// 挂载原生dom
function mountElement(vnode: any, container: any) {
    const el = vnode.el = document.createElement<'div'>(vnode.type);
    // children 有两种类型 string (就是内容 text)     Array (就是有子集 可能是 组件 可能是 dom)
    const { children, props } = vnode;

    // 处理 children
    if (Array.isArray(children)) mountChildren(children, el)
    else if (typeof children === 'string') el.textContent = children;

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
function processComponent(vnode: any, container: any) {
    // 挂载组件
    mountComponent(vnode, container)
}

// 挂载组件
function mountComponent(vnode: any, container) {
    // 创建实例
    const instance = createComponentInstance(vnode);

    // 初始化 props slots 等等
    setupComponent(instance);

    // 进行执行 render 函数
    setupRenderEffect(instance, vnode, container)
}

/**
 * ------------------------ 渲染组件的时候 ------------------------
 */

function mountChildren(children, container) {
    for (let index = 0; index < children.length; index++) {
        patch(children[index], container)
    };
}

// s
function setupRenderEffect(instance: any, vnode, container) {
    const { proxy } = instance;

    // 虚拟节点树
    const subTree = instance.render.call(proxy);

    // vnode -> patch
    // 挂载 element
    // vnode -> element -> mountElement

    patch(subTree, container);

    vnode.el = subTree.el;
}

