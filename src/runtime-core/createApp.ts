import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
    // 挂载根节点
    return {
        mount(rootContainer) {
            const container = document.querySelector(rootContainer);
            // 

            // 挂载根节点 创建虚拟DOM
            const vnode = createVNode(rootComponent);
            render(vnode, container);
        }
    }
}