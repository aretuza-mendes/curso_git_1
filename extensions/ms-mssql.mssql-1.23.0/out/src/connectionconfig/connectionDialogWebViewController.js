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
exports.ConnectionDialogWebViewController = void 0;
const vscode = require("vscode");
const reactWebviewController_1 = require("../controllers/reactWebviewController");
const connectionDialog_1 = require("../sharedInterfaces/connectionDialog");
const connectionInfo_1 = require("../models/connectionInfo");
const azureController_1 = require("../azure/azureController");
class ConnectionDialogWebViewController extends reactWebviewController_1.ReactWebViewPanelController {
    constructor(context, _mainController, _objectExplorerProvider, _connectionToEdit) {
        super(context, 'Connection Dialog', 'connectionDialog.js', 'connectionDialog.css', {
            recentConnections: [],
            selectedFormTab: connectionDialog_1.FormTabs.Parameters,
            connectionProfile: {},
            formComponents: [],
            connectionStatus: connectionDialog_1.ApiStatus.NotStarted,
            formError: ''
        }, vscode.ViewColumn.Active, {
            dark: vscode.Uri.joinPath(context.extensionUri, 'media', 'connectionDialogEditor_inverse.svg'),
            light: vscode.Uri.joinPath(context.extensionUri, 'media', 'connectionDialogEditor.svg')
        });
        this._mainController = _mainController;
        this._objectExplorerProvider = _objectExplorerProvider;
        this._connectionToEdit = _connectionToEdit;
        this.registerRpcHandlers();
        this.initializeDialog().catch(err => vscode.window.showErrorMessage(err.toString()));
    }
    initializeDialog() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadRecentConnections();
            if (this._connectionToEdit) {
                yield this.loadConnectionToEdit();
            }
            else {
                yield this.loadEmptyConnection();
            }
            this.state.formComponents = yield this.generateFormComponents();
            yield this.updateItemVisibility();
            this.state = this.state;
        });
    }
    loadRecentConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            const recentConnections = this._mainController.connectionManager.connectionStore.loadAllConnections(true).map(c => c.connectionCreds);
            const dialogConnections = [];
            for (let i = 0; i < recentConnections.length; i++) {
                dialogConnections.push(yield this.initializeConnectionForDialog(recentConnections[i]));
            }
            this.state.recentConnections = dialogConnections;
            this.state = this.state;
        });
    }
    loadConnectionToEdit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._connectionToEdit) {
                this._connectionToEditCopy = structuredClone(this._connectionToEdit);
                const connection = yield this.initializeConnectionForDialog(this._connectionToEdit);
                this.state.connectionProfile = connection;
                this.state = this.state;
            }
        });
    }
    loadEmptyConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const emptyConnection = {
                authenticationType: connectionDialog_1.AuthenticationType.SqlLogin,
            };
            this.state.connectionProfile = emptyConnection;
        });
    }
    initializeConnectionForDialog(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Load the password if it's saved
            const isConnectionStringConnection = connection.connectionString !== undefined && connection.connectionString !== '';
            const password = yield this._mainController.connectionManager.connectionStore.lookupPassword(connection, isConnectionStringConnection);
            if (!isConnectionStringConnection) {
                connection.password = password;
            }
            else {
                connection.connectionString = '';
                // extract password from connection string it starts after 'Password=' and ends before ';'
                const passwordIndex = password.indexOf('Password=') === -1 ? password.indexOf('password=') : password.indexOf('Password=');
                if (passwordIndex !== -1) {
                    const passwordStart = passwordIndex + 'Password='.length;
                    const passwordEnd = password.indexOf(';', passwordStart);
                    if (passwordEnd !== -1) {
                        connection.password = password.substring(passwordStart, passwordEnd);
                    }
                }
            }
            const dialogConnection = connection;
            // Set the profile name
            dialogConnection.profileName = (_a = dialogConnection.profileName) !== null && _a !== void 0 ? _a : (0, connectionInfo_1.getConnectionDisplayName)(connection);
            return dialogConnection;
        });
    }
    updateItemVisibility() {
        return __awaiter(this, void 0, void 0, function* () {
            const selectedTab = this.state.selectedFormTab;
            let hiddenProperties = [];
            if (selectedTab === connectionDialog_1.FormTabs.ConnectionString) {
                hiddenProperties = [
                    'server',
                    'authenticationType',
                    'user',
                    'password',
                    'savePassword',
                    'accountId',
                    'tenantId',
                    'database',
                    'trustServerCertificate',
                    'encrypt'
                ];
            }
            else {
                hiddenProperties = [
                    'connectionString'
                ];
                if (this.state.connectionProfile.authenticationType !== connectionDialog_1.AuthenticationType.SqlLogin) {
                    hiddenProperties.push('user', 'password', 'savePassword');
                }
                if (this.state.connectionProfile.authenticationType !== connectionDialog_1.AuthenticationType.AzureMFA) {
                    hiddenProperties.push('accountId', 'tenantId');
                }
                if (this.state.connectionProfile.authenticationType === connectionDialog_1.AuthenticationType.AzureMFA) {
                    // Hide tenantId if accountId has only one tenant
                    const tenants = yield this.getTenants(this.state.connectionProfile.accountId);
                    if (tenants.length === 1) {
                        hiddenProperties.push('tenantId');
                    }
                }
            }
            for (let i = 0; i < this.state.formComponents.length; i++) {
                const component = this.state.formComponents[i];
                if (hiddenProperties.includes(component.propertyName)) {
                    component.hidden = true;
                }
                else {
                    component.hidden = false;
                }
            }
        });
    }
    getFormComponent(propertyName) {
        return this.state.formComponents.find(c => c.propertyName === propertyName);
    }
    getAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield this._mainController.azureAccountService.getAccounts();
            return accounts.map(account => {
                return {
                    displayName: account.displayInfo.displayName,
                    value: account.displayInfo.userId
                };
            });
        });
    }
    getTenants(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = (yield this._mainController.azureAccountService.getAccounts()).find(account => account.displayInfo.userId === accountId);
            if (!account) {
                return [];
            }
            const tenants = account.properties.tenants;
            if (!tenants) {
                return [];
            }
            return tenants.map(tenant => {
                return {
                    displayName: tenant.displayName,
                    value: tenant.id
                };
            });
        });
    }
    generateFormComponents() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [
                {
                    type: connectionDialog_1.FormComponentType.Input,
                    propertyName: 'server',
                    label: 'Server',
                    required: true,
                    validate: (value) => {
                        if (this.state.selectedFormTab === connectionDialog_1.FormTabs.Parameters && !value) {
                            return {
                                isValid: false,
                                validationMessage: 'Server is required'
                            };
                        }
                        return {
                            isValid: true,
                            validationMessage: ''
                        };
                    }
                },
                {
                    type: connectionDialog_1.FormComponentType.TextArea,
                    propertyName: 'connectionString',
                    label: 'Connection String',
                    required: true,
                    validate: (value) => {
                        if (this.state.selectedFormTab === connectionDialog_1.FormTabs.ConnectionString && !value) {
                            return {
                                isValid: false,
                                validationMessage: 'Connection string is required'
                            };
                        }
                        return {
                            isValid: true,
                            validationMessage: ''
                        };
                    }
                },
                {
                    type: connectionDialog_1.FormComponentType.Dropdown,
                    propertyName: 'authenticationType',
                    label: 'Authentication Type',
                    required: true,
                    options: [
                        {
                            displayName: 'SQL Login',
                            value: connectionDialog_1.AuthenticationType.SqlLogin
                        },
                        {
                            displayName: 'Windows Authentication',
                            value: connectionDialog_1.AuthenticationType.Integrated
                        },
                        {
                            displayName: 'Azure MFA',
                            value: connectionDialog_1.AuthenticationType.AzureMFA
                        }
                    ],
                },
                {
                    // Hidden if connection string is set or if the authentication type is not SQL Login
                    propertyName: 'user',
                    label: 'User Name',
                    type: connectionDialog_1.FormComponentType.Input,
                    required: true,
                    validate: (value) => {
                        if (this.state.connectionProfile.authenticationType === connectionDialog_1.AuthenticationType.SqlLogin && !value) {
                            return {
                                isValid: false,
                                validationMessage: 'User name is required'
                            };
                        }
                        return {
                            isValid: true,
                            validationMessage: ''
                        };
                    }
                },
                {
                    propertyName: 'password',
                    label: 'Password',
                    required: false,
                    type: connectionDialog_1.FormComponentType.Password,
                },
                {
                    propertyName: 'savePassword',
                    label: 'Save Password',
                    required: false,
                    type: connectionDialog_1.FormComponentType.Checkbox,
                },
                {
                    propertyName: 'accountId',
                    label: 'Azure Account',
                    required: true,
                    type: connectionDialog_1.FormComponentType.Dropdown,
                    options: yield this.getAccounts(),
                    placeholder: 'Select an account',
                    actionButtons: yield this.getAzureActionButtons(),
                    validate: (value) => {
                        if (this.state.connectionProfile.authenticationType === connectionDialog_1.AuthenticationType.AzureMFA && !value) {
                            return {
                                isValid: false,
                                validationMessage: 'Azure Account is required'
                            };
                        }
                        return {
                            isValid: true,
                            validationMessage: ''
                        };
                    },
                },
                {
                    propertyName: 'tenantId',
                    label: 'Tenant ID',
                    required: true,
                    type: connectionDialog_1.FormComponentType.Dropdown,
                    options: [],
                    hidden: true,
                    placeholder: 'Select a tenant',
                    validate: (value) => {
                        if (this.state.connectionProfile.authenticationType === connectionDialog_1.AuthenticationType.AzureMFA && !value) {
                            return {
                                isValid: false,
                                validationMessage: 'Tenant ID is required'
                            };
                        }
                        return {
                            isValid: true,
                            validationMessage: ''
                        };
                    }
                },
                {
                    propertyName: 'database',
                    label: 'Database',
                    required: false,
                    type: connectionDialog_1.FormComponentType.Input,
                },
                {
                    propertyName: 'trustServerCertificate',
                    label: 'Trust Server Certificate',
                    required: false,
                    type: connectionDialog_1.FormComponentType.Checkbox,
                },
                {
                    propertyName: 'encrypt',
                    label: 'Encrypt Connection',
                    required: false,
                    type: connectionDialog_1.FormComponentType.Dropdown,
                    options: [
                        {
                            displayName: 'Optional',
                            value: 'Optional'
                        },
                        {
                            displayName: 'Mandatory',
                            value: 'Mandatory'
                        },
                        {
                            displayName: 'Strict  (Requires SQL Server 2022 or Azure SQL)',
                            value: 'Strict'
                        }
                    ],
                },
                {
                    propertyName: 'profileName',
                    label: 'Profile Name',
                    required: false,
                    type: connectionDialog_1.FormComponentType.Input,
                }
            ];
            return result;
        });
    }
    validateFormComponents(propertyName) {
        return __awaiter(this, void 0, void 0, function* () {
            let errorCount = 0;
            if (propertyName) {
                const component = this.getFormComponent(propertyName);
                if (component && component.validate) {
                    component.validation = component.validate(this.state.connectionProfile[propertyName]);
                    if (!component.validation.isValid) {
                        return 1;
                    }
                }
            }
            else {
                this.state.formComponents.forEach(c => {
                    if (c.hidden) {
                        c.validation = {
                            isValid: true,
                            validationMessage: ''
                        };
                        return;
                    }
                    else {
                        if (c.validate) {
                            c.validation = c.validate(this.state.connectionProfile[c.propertyName]);
                            if (!c.validation.isValid) {
                                errorCount++;
                            }
                        }
                    }
                });
            }
            return errorCount;
        });
    }
    getAzureActionButtons() {
        return __awaiter(this, void 0, void 0, function* () {
            const actionButtons = [];
            actionButtons.push({
                label: 'Sign in',
                id: 'azureSignIn',
                callback: () => __awaiter(this, void 0, void 0, function* () {
                    const account = yield this._mainController.azureAccountService.addAccount();
                    const accountsComponent = this.getFormComponent('accountId');
                    if (accountsComponent) {
                        accountsComponent.options = yield this.getAccounts();
                        this.state.connectionProfile.accountId = account.key.id;
                        this.state = this.state;
                        yield this.handleAzureMFAEdits('accountId');
                    }
                })
            });
            if (this.state.connectionProfile.authenticationType === connectionDialog_1.AuthenticationType.AzureMFA && this.state.connectionProfile.accountId) {
                const account = (yield this._mainController.azureAccountService.getAccounts()).find(account => account.displayInfo.userId === this.state.connectionProfile.accountId);
                if (account) {
                    const session = yield this._mainController.azureAccountService.getAccountSecurityToken(account, undefined);
                    const isTokenExpired = azureController_1.AzureController.isTokenInValid(session.token, session.expiresOn);
                    if (isTokenExpired) {
                        actionButtons.push({
                            label: 'Refresh Token',
                            id: 'refreshToken',
                            callback: () => __awaiter(this, void 0, void 0, function* () {
                                const account = (yield this._mainController.azureAccountService.getAccounts()).find(account => account.displayInfo.userId === this.state.connectionProfile.accountId);
                                if (account) {
                                    const session = yield this._mainController.azureAccountService.getAccountSecurityToken(account, undefined);
                                    console.log('Token refreshed', session.expiresOn);
                                }
                            })
                        });
                    }
                }
            }
            return actionButtons;
        });
    }
    handleAzureMFAEdits(propertyName) {
        return __awaiter(this, void 0, void 0, function* () {
            const mfaComponents = ['accountId', 'tenantId', 'authenticationType'];
            if (mfaComponents.includes(propertyName)) {
                if (this.state.connectionProfile.authenticationType !== connectionDialog_1.AuthenticationType.AzureMFA) {
                    return;
                }
                const accountComponent = this.getFormComponent('accountId');
                const tenantComponent = this.getFormComponent('tenantId');
                let tenants = [];
                switch (propertyName) {
                    case 'accountId':
                        tenants = yield this.getTenants(this.state.connectionProfile.accountId);
                        if (tenantComponent) {
                            tenantComponent.options = tenants;
                            if (tenants && tenants.length > 0) {
                                this.state.connectionProfile.tenantId = tenants[0].value;
                            }
                        }
                        accountComponent.actionButtons = yield this.getAzureActionButtons();
                        break;
                    case 'tenantId':
                        break;
                    case 'authenticationType':
                        const firstOption = accountComponent.options[0];
                        if (firstOption) {
                            this.state.connectionProfile.accountId = firstOption.value;
                        }
                        tenants = yield this.getTenants(this.state.connectionProfile.accountId);
                        if (tenantComponent) {
                            tenantComponent.options = tenants;
                            if (tenants && tenants.length > 0) {
                                this.state.connectionProfile.tenantId = tenants[0].value;
                            }
                        }
                        accountComponent.actionButtons = yield this.getAzureActionButtons();
                        break;
                }
            }
        });
    }
    clearFormError() {
        this.state.formError = '';
        for (let i = 0; i < this.state.formComponents.length; i++) {
            this.state.formComponents[i].validation = undefined;
        }
    }
    registerRpcHandlers() {
        this.registerReducers({
            'setFormTab': (state, payload) => __awaiter(this, void 0, void 0, function* () {
                this.state.selectedFormTab = payload.tab;
                yield this.updateItemVisibility();
                return state;
            }),
            'formAction': (state, payload) => __awaiter(this, void 0, void 0, function* () {
                if (payload.event.isAction) {
                    const component = this.getFormComponent(payload.event.propertyName);
                    if (component && component.actionButtons) {
                        const actionButton = component.actionButtons.find(b => b.id === payload.event.value);
                        if (actionButton === null || actionButton === void 0 ? void 0 : actionButton.callback) {
                            yield actionButton.callback();
                        }
                    }
                }
                else {
                    this.state.connectionProfile[payload.event.propertyName] = payload.event.value;
                    yield this.validateFormComponents(payload.event.propertyName);
                    yield this.handleAzureMFAEdits(payload.event.propertyName);
                }
                yield this.updateItemVisibility();
                return state;
            }),
            'loadConnection': (state, payload) => __awaiter(this, void 0, void 0, function* () {
                this._connectionToEditCopy = structuredClone(payload.connection);
                this.clearFormError();
                this.state.connectionProfile = payload.connection;
                yield this.updateItemVisibility();
                yield this.handleAzureMFAEdits('azureAuthType');
                yield this.handleAzureMFAEdits('accountId');
                return state;
            }),
            'connect': (state) => __awaiter(this, void 0, void 0, function* () {
                this.clearFormError();
                this.state.connectionStatus = connectionDialog_1.ApiStatus.Loading;
                this.state.formError = '';
                this.state = this.state;
                const notHiddenComponents = this.state.formComponents.filter(c => !c.hidden).map(c => c.propertyName);
                // Set all other fields to undefined
                Object.keys(this.state.connectionProfile).forEach(key => {
                    if (!notHiddenComponents.includes(key)) {
                        this.state.connectionProfile[key] = undefined;
                    }
                });
                const errorCount = yield this.validateFormComponents();
                if (errorCount > 0) {
                    this.state.connectionStatus = connectionDialog_1.ApiStatus.Error;
                    return state;
                }
                try {
                    const result = yield this._mainController.connectionManager.connectionUI.validateAndSaveProfileFromDialog(this.state.connectionProfile);
                    if (result === null || result === void 0 ? void 0 : result.errorMessage) {
                        this.state.formError = result.errorMessage;
                        this.state.connectionStatus = connectionDialog_1.ApiStatus.Error;
                        return state;
                    }
                    if (this._connectionToEditCopy) {
                        yield this._mainController.connectionManager.getUriForConnection(this._connectionToEditCopy);
                        yield this._objectExplorerProvider.removeConnectionNodes([this._connectionToEditCopy]);
                        yield this._mainController.connectionManager.connectionStore.removeProfile(this._connectionToEditCopy);
                        yield this._objectExplorerProvider.refresh(undefined);
                    }
                    yield this._mainController.connectionManager.connectionUI.saveProfile(this.state.connectionProfile);
                    const node = yield this._mainController.createObjectExplorerSessionFromDialog(this.state.connectionProfile);
                    yield this._objectExplorerProvider.refresh(undefined);
                    yield this.loadRecentConnections();
                    this.state.connectionStatus = connectionDialog_1.ApiStatus.Loaded;
                    yield this._mainController.objectExplorerTree.reveal(node, { focus: true, select: true, expand: true });
                    yield this.panel.dispose();
                }
                catch (error) {
                    this.state.connectionStatus = connectionDialog_1.ApiStatus.Error;
                    return state;
                }
                return state;
            })
        });
    }
}
exports.ConnectionDialogWebViewController = ConnectionDialogWebViewController;

//# sourceMappingURL=connectionDialogWebViewController.js.map
