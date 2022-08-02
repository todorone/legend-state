import { isPrimitive } from './is';
import { ObservableChecker, ObservableWrapper, PathNode, ProxyValue } from './observableInterfaces';
import state from './state';

export const delim = '\uFEFF';
export const arrPaths = [];

export const symbolDateModified = Symbol('dateModified');
export const symbolShallow = Symbol('shallow');
export const symbolShouldRender = Symbol('shouldRender');
export const symbolValue = Symbol('value');
export const symbolProp = Symbol('prop');
export const symbolID = Symbol('id');
export const symbolGet = Symbol('get');

export function getNodeValue(node: PathNode): any {
    let child = node.root;
    const arr = node.path.split(delim);
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] && child) {
            child = child[arr[i]];
        }
    }
    return child;
}
export function getProxyValue({ root, path }: ProxyValue) {
    const node = getPathNode(root, path);
    return getNodeValue(node);
}
export function hasPathNode(root: ObservableWrapper, path: string, key?: string) {
    if (key !== undefined && path !== undefined) {
        path += delim + key;
    }
    return root.pathNodes.has(path);
}
export function getPathNode(root: ObservableWrapper, path: string, key?: string, noCreate?: boolean) {
    const parent = path;
    if (key !== undefined && path !== undefined) {
        path += delim + key;
    }

    let pathNode = root.pathNodes.get(path);
    if (!pathNode && !noCreate) {
        pathNode = {
            root,
            path,
            parent,
            key,
        };
        root.pathNodes.set(path, pathNode);
    }
    return pathNode;
}

export function getParentNode(node: PathNode) {
    return getPathNode(node.root, node.parent);
}

// export function getObjectNode(obj: any) {
//     const id = obj._?.id;
//     if (id !== undefined) {
//         return arrPaths[id];
//     }
// }

export function get(proxy: ProxyValue) {
    const node = getPathNode(proxy.root, proxy.path);
    return getNodeValue(node);
}

export function getObservableRawValue<T>(obs: ObservableChecker<T>): T {
    if (!obs || isPrimitive(obs)) return obs as T;

    const eq = obs[symbolShouldRender];
    if (eq) {
        state.trackingShouldRender = eq.fn;
        obs = eq.obs;
    }
    const shallow = obs[symbolShallow];
    if (shallow) {
        state.trackingShallow = true;
        obs = shallow;
    }
    let ret = obs[symbolGet];

    state.trackingShouldRender = undefined;
    state.trackingShallow = false;

    return ret;
}
