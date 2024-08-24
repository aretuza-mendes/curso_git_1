"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonce = exports.DefaultWebViewNotifications = exports.ReactWebViewPanelController = void 0;
const vscode = require("vscode");
class ReactWebViewPanelController {
    constructor(_context, title, _srcFile, _styleFile, initialData, viewColumn = vscode.ViewColumn.One, _iconPath) {
        this._context = _context;
        this._srcFile = _srcFile;
        this._styleFile = _styleFile;
        this._iconPath = _iconPath;
        this._disposables = [];
        this._isDisposed = false;
        this._webViewRequestHandlers = {};
        this._reducers = {};
        this._panel = vscode.window.createWebviewPanel('mssql-react-webview', title, viewColumn, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        this._panel.webview.html = this._getHtmlTemplate();
        this._panel.iconPath = this._iconPath;
        this._disposables.push(this._panel.webview.onDidReceiveMessage((message) => {
            if (message.type === 'request') {
                const handler = this._webViewRequestHandlers[message.method];
                if (handler) {
                    const result = handler(message.params);
                    this.postMessage({ type: 'response', id: message.id, result });
                }
                else {
                    throw new Error(`No handler registered for method ${message.method}`);
                }
            }
        }));
        this._panel.onDidDispose(() => {
            this.dispose();
        });
        this.setupTheming();
        this._registerDefaultRequestHandlers();
        this.state = initialData;
    }
    setupTheming() {
        this._disposables.push(vscode.window.onDidChangeActiveColorTheme((theme) => {
            this.postNotification('onDidChangeTheme', theme.kind);
        }));
        this.postNotification('onDidChangeTheme', vscode.window.activeColorTheme.kind);
    }
    _registerDefaultRequestHandlers() {
        this._webViewRequestHandlers['getState'] = () => {
            return this.state;
        };
        this._webViewRequestHandlers['getImageUrl'] = (path) => {
            return this.resourceUrl(path).toString();
        };
        this._webViewRequestHandlers['action'] = (action) => __awaiter(this, void 0, void 0, function* () {
            const reducer = this._reducers[action.type];
            if (reducer) {
                this.state = yield reducer(this.state, action.payload);
            }
            else {
                throw new Error(`No reducer registered for action ${action.type}`);
            }
        });
        this._webViewRequestHandlers['getTheme'] = () => {
            return vscode.window.activeColorTheme.kind;
        };
    }
    registerRequestHandler(method, handler) {
        this._webViewRequestHandlers[method] = handler;
    }
    registerReducer(method, reducer) {
        this._reducers[method] = reducer;
    }
    registerReducers(reducers) {
        for (const key in reducers) {
            this.registerReducer(key, reducers[key]);
        }
    }
    _getHtmlTemplate() {
        const nonce = getNonce();
        const scriptUri = this.resourceUrl([this._srcFile]);
        const styleUri = this.resourceUrl([this._styleFile]);
        return `
		<!DOCTYPE html>
				<html lang="en">
				<head>
				  <meta charset="UTF-8">
				  <meta name="viewport" content="width=device-width, initial-scale=1.0">
				  <title>mssqlwebview</title>
				  <link rel="stylesheet" href="${styleUri}">
				  <style>
					html, body {
						margin: 0;
						padding: 0px;
  						width: 100%;
  						height: 100%;
					}
				  </style>
				</head>
				<body>
				  <div id="root"></div>
				  <script nonce="${nonce}" src="${scriptUri}"></script>
				</body>
				</html>
		`;
    }
    resourceUrl(path) {
        return this._panel.webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'out', 'src', 'reactviews', 'assets', ...path));
    }
    get panel() {
        return this._panel;
    }
    revealToForeground(viewColumn = vscode.ViewColumn.One) {
        this._panel.reveal(viewColumn, true);
    }
    get state() {
        return this._state;
    }
    set state(value) {
        this._state = value;
        this.postNotification(DefaultWebViewNotifications.updateState, value);
    }
    get isDisposed() {
        return this._isDisposed;
    }
    postNotification(method, params) {
        this.postMessage({ type: 'notification', method, params });
    }
    postMessage(message) {
        this._panel.webview.postMessage(message);
    }
    dispose() {
        this._disposables.forEach(d => d.dispose());
        this._isDisposed = true;
    }
}
exports.ReactWebViewPanelController = ReactWebViewPanelController;
var DefaultWebViewNotifications;
(function (DefaultWebViewNotifications) {
    DefaultWebViewNotifications["updateState"] = "updateState";
})(DefaultWebViewNotifications || (exports.DefaultWebViewNotifications = DefaultWebViewNotifications = {}));
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
exports.getNonce = getNonce;

//# sourceMappingURL=reactWebviewController.js.map
