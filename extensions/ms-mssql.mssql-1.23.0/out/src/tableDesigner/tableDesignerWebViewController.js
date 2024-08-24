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
exports.TableDesignerWebViewController = void 0;
const vscode = require("vscode");
const crypto_1 = require("crypto");
const reactWebviewController_1 = require("../controllers/reactWebviewController");
const designer = require("./tableDesignerInterfaces");
const tableDesignerTabDefinition_1 = require("./tableDesignerTabDefinition");
class TableDesignerWebViewController extends reactWebviewController_1.ReactWebViewPanelController {
    constructor(context, _tableDesignerService, _connectionManager, _untitledSqlDocumentService, _targetNode) {
        super(context, 'Table Designer', 'tableDesigner.js', 'tableDesigner.css', {
            apiState: {
                editState: designer.LoadState.NotStarted,
                generateScriptState: designer.LoadState.NotStarted,
                previewState: designer.LoadState.NotStarted,
                publishState: designer.LoadState.NotStarted,
                initializeState: designer.LoadState.Loading
            }
        }, vscode.ViewColumn.Active, {
            dark: vscode.Uri.joinPath(context.extensionUri, 'media', 'tableDesignerEditor_inverse.svg'),
            light: vscode.Uri.joinPath(context.extensionUri, 'media', 'tableDesignerEditor.svg')
        });
        this._tableDesignerService = _tableDesignerService;
        this._connectionManager = _connectionManager;
        this._untitledSqlDocumentService = _untitledSqlDocumentService;
        this._targetNode = _targetNode;
        this._isEdit = false;
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._targetNode) {
                yield vscode.window.showErrorMessage('Unable to find object explorer node');
                return;
            }
            this._isEdit = this._targetNode.nodeType === 'Table' || this._targetNode.nodeType === 'View' ? true : false;
            const targetDatabase = this.getDatabaseNameForNode(this._targetNode);
            // get database name from connection string
            const databaseName = targetDatabase ? targetDatabase : 'master';
            const connectionInfo = this._targetNode.connectionInfo;
            connectionInfo.database = databaseName;
            const connectionDetails = yield this._connectionManager.createConnectionDetails(connectionInfo);
            const connectionString = yield this._connectionManager.getConnectionString(connectionDetails, true, true);
            if (!connectionString || connectionString === '') {
                yield vscode.window.showErrorMessage('Unable to find connection string for the connection');
                return;
            }
            try {
                let tableInfo;
                if (this._isEdit) {
                    tableInfo = {
                        id: (0, crypto_1.randomUUID)(),
                        isNewTable: false,
                        title: this._targetNode.label,
                        tooltip: `${connectionInfo.server} - ${databaseName} - ${this._targetNode.label}`,
                        server: connectionInfo.server,
                        database: databaseName,
                        connectionString: connectionString,
                        schema: this._targetNode.metadata.schema,
                        name: this._targetNode.metadata.name
                    };
                }
                else {
                    tableInfo = {
                        id: (0, crypto_1.randomUUID)(),
                        isNewTable: true,
                        title: 'New Table',
                        tooltip: `${connectionInfo.server} - ${databaseName} - New Table`,
                        server: connectionInfo.server,
                        database: databaseName,
                        connectionString: connectionString
                    };
                }
                this.panel.title = tableInfo.title;
                const intializeData = yield this._tableDesignerService.initializeTableDesigner(tableInfo);
                intializeData.tableInfo.database = databaseName !== null && databaseName !== void 0 ? databaseName : 'master';
                this.state = {
                    tableInfo: tableInfo,
                    view: (0, tableDesignerTabDefinition_1.getDesignerView)(intializeData.view),
                    model: intializeData.viewModel,
                    issues: intializeData.issues,
                    isValid: true,
                    tabStates: {
                        mainPaneTab: designer.DesignerMainPaneTabs.AboutTable,
                        resultPaneTab: designer.DesignerResultPaneTabs.Script
                    },
                    apiState: Object.assign(Object.assign({}, this.state.apiState), { initializeState: designer.LoadState.Loaded })
                };
            }
            catch (e) {
                yield vscode.window.showErrorMessage('Error initializing table designer: ' + e);
                this.state.apiState.initializeState = designer.LoadState.Error;
                this.state = this.state;
            }
            this.registerRpcHandlers();
        });
    }
    getDatabaseNameForNode(node) {
        var _a;
        if (((_a = node.metadata) === null || _a === void 0 ? void 0 : _a.metadataTypeName) === 'Database') {
            return node.metadata.name;
        }
        else {
            if (node.parentNode) {
                return this.getDatabaseNameForNode(node.parentNode);
            }
        }
        return '';
    }
    registerRpcHandlers() {
        this.registerReducers({
            'processTableEdit': (state, payload) => __awaiter(this, void 0, void 0, function* () {
                const editResponse = yield this._tableDesignerService.processTableEdit(payload.table, payload.tableChangeInfo);
                const afterEditState = Object.assign(Object.assign({}, this.state), { view: editResponse.view ? (0, tableDesignerTabDefinition_1.getDesignerView)(editResponse.view) : this.state.view, model: editResponse.viewModel, issues: editResponse.issues, isValid: editResponse.isValid, apiState: Object.assign(Object.assign({}, this.state.apiState), { editState: designer.LoadState.Loaded }) });
                return afterEditState;
            }),
            'publishChanges': (state, payload) => __awaiter(this, void 0, void 0, function* () {
                this.state = Object.assign(Object.assign({}, this.state), { apiState: Object.assign(Object.assign({}, this.state.apiState), { publishState: designer.LoadState.Loading }) });
                const publishResponse = yield this._tableDesignerService.publishChanges(payload.table);
                state = Object.assign(Object.assign({}, state), { tableInfo: publishResponse.newTableInfo, view: (0, tableDesignerTabDefinition_1.getDesignerView)(publishResponse.view), model: publishResponse.viewModel, apiState: Object.assign(Object.assign({}, state.apiState), { publishState: designer.LoadState.Loaded, previewState: designer.LoadState.NotStarted }) });
                this.panel.title = state.tableInfo.title;
                return state;
            }),
            'generateScript': (state, payload) => __awaiter(this, void 0, void 0, function* () {
                this.state = Object.assign(Object.assign({}, this.state), { apiState: Object.assign(Object.assign({}, this.state.apiState), { generateScriptState: designer.LoadState.Loading }) });
                const script = yield this._tableDesignerService.generateScript(payload.table);
                state = Object.assign(Object.assign({}, state), { apiState: Object.assign(Object.assign({}, state.apiState), { generateScriptState: designer.LoadState.Loaded }) });
                this._untitledSqlDocumentService.newQuery(script);
                return state;
            }),
            'generatePreviewReport': (state, payload) => __awaiter(this, void 0, void 0, function* () {
                this.state = Object.assign(Object.assign({}, this.state), { apiState: Object.assign(Object.assign({}, this.state.apiState), { previewState: designer.LoadState.Loading }) });
                const previewReport = yield this._tableDesignerService.generatePreviewReport(payload.table);
                state = Object.assign(Object.assign({}, state), { apiState: Object.assign(Object.assign({}, state.apiState), { previewState: designer.LoadState.Loaded }), generatePreviewReportResult: previewReport });
                return state;
            }),
            'initializeTableDesigner': (state, payload) => __awaiter(this, void 0, void 0, function* () {
                yield this.initialize();
                return state;
            }),
            'scriptAsCreate': (state, payload) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                yield this._untitledSqlDocumentService.newQuery((_a = state.model['script'].value) !== null && _a !== void 0 ? _a : '');
                return state;
            }),
            'setTab': (state, payload) => __awaiter(this, void 0, void 0, function* () {
                state.tabStates.mainPaneTab = payload.tabId;
                return state;
            }),
            'setPropertiesComponents': (state, payload) => __awaiter(this, void 0, void 0, function* () {
                state.propertiesPaneData = payload.components;
                return state;
            }),
            'setResultTab': (state, payload) => __awaiter(this, void 0, void 0, function* () {
                state.tabStates.resultPaneTab = payload.tabId;
                return state;
            }),
            'closeDesigner': (state, payload) => __awaiter(this, void 0, void 0, function* () {
                this.panel.dispose();
                return state;
            }),
            'continueEditing': (state, payload) => __awaiter(this, void 0, void 0, function* () {
                this.state.apiState.publishState = designer.LoadState.NotStarted;
                return state;
            })
        });
    }
}
exports.TableDesignerWebViewController = TableDesignerWebViewController;

//# sourceMappingURL=tableDesignerWebViewController.js.map
