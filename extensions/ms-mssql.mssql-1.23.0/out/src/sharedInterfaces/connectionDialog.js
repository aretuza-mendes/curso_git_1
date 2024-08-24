"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationType = exports.FormComponentType = exports.ApiStatus = exports.FormTabs = void 0;
var FormTabs;
(function (FormTabs) {
    FormTabs["Parameters"] = "parameter";
    FormTabs["ConnectionString"] = "connString";
})(FormTabs || (exports.FormTabs = FormTabs = {}));
var ApiStatus;
(function (ApiStatus) {
    ApiStatus["NotStarted"] = "notStarted";
    ApiStatus["Loading"] = "loading";
    ApiStatus["Loaded"] = "loaded";
    ApiStatus["Error"] = "error";
})(ApiStatus || (exports.ApiStatus = ApiStatus = {}));
/**
 * Enum for the type of form component
 */
var FormComponentType;
(function (FormComponentType) {
    FormComponentType["Input"] = "input";
    FormComponentType["Dropdown"] = "dropdown";
    FormComponentType["Checkbox"] = "checkbox";
    FormComponentType["Password"] = "password";
    FormComponentType["Button"] = "button";
    FormComponentType["TextArea"] = "textarea";
})(FormComponentType || (exports.FormComponentType = FormComponentType = {}));
var AuthenticationType;
(function (AuthenticationType) {
    AuthenticationType["SqlLogin"] = "SqlLogin";
    AuthenticationType["Integrated"] = "Integrated";
    AuthenticationType["AzureMFA"] = "AzureMFA";
})(AuthenticationType || (exports.AuthenticationType = AuthenticationType = {}));

//# sourceMappingURL=connectionDialog.js.map
