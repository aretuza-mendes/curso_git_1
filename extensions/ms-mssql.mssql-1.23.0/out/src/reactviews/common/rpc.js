"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebviewRpc = void 0;
class WebviewRpc {
    constructor(_vscodeApi) {
        this._vscodeApi = _vscodeApi;
        this._rpcRequestId = 0;
        this._rpcHandlers = {};
        this._methodSubscriptions = {};
        window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.type === 'response') {
                const { id, result, error } = message;
                if (this._rpcHandlers[id]) {
                    if (error) {
                        this._rpcHandlers[id].reject(error);
                    }
                    else {
                        this._rpcHandlers[id].resolve(result);
                    }
                    delete this._rpcHandlers[id];
                }
            }
            if (message.type === 'notification') {
                const { method, params } = message;
                if (this._methodSubscriptions[method]) {
                    this._methodSubscriptions[method].forEach(callback => callback(params));
                }
            }
        });
    }
    call(method, params) {
        const id = this._rpcRequestId++;
        this._vscodeApi.postMessage({ type: 'request', id, method, params });
        return new Promise((resolve, reject) => {
            this._rpcHandlers[id] = { resolve, reject };
        });
    }
    action(type, payload) {
        this.call('action', { type, payload });
    }
    subscribe(method, callback) {
        if (!this._methodSubscriptions[method]) {
            this._methodSubscriptions[method] = [];
        }
        this._methodSubscriptions[method].push(callback);
    }
}
exports.WebviewRpc = WebviewRpc;

//# sourceMappingURL=rpc.js.map
