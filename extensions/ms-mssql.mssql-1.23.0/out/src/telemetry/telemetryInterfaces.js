"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryActions = exports.TelemetryViews = void 0;
var TelemetryViews;
(function (TelemetryViews) {
    TelemetryViews["ObjectExplorer"] = "ObjectExplorer";
    TelemetryViews["CommandPallet"] = "CommandPallet";
    TelemetryViews["SqlProjects"] = "SqlProjects";
    TelemetryViews["QueryEditor"] = "QueryEditor";
    TelemetryViews["ResultsGrid"] = "ResultsGrid";
    TelemetryViews["ConnectionPrompt"] = "ConnectionPrompt";
})(TelemetryViews || (exports.TelemetryViews = TelemetryViews = {}));
var TelemetryActions;
(function (TelemetryActions) {
    TelemetryActions["GenerateScript"] = "GenerateScript";
    TelemetryActions["Refresh"] = "Refresh";
    TelemetryActions["CreateProject"] = "CreateProject";
    TelemetryActions["RemoveConnection"] = "RemoveConnection";
    TelemetryActions["Disconnect"] = "Disconnect";
    TelemetryActions["NewQuery"] = "NewQuery";
    TelemetryActions["RunQuery"] = "RunQuery";
    TelemetryActions["QueryExecutionCompleted"] = "QueryExecutionCompleted";
    TelemetryActions["RunResultPaneAction"] = "RunResultPaneAction";
    TelemetryActions["CreateConnection"] = "CreateConnection";
    TelemetryActions["CreateConnectionResult"] = "CreateConnectionResult";
    TelemetryActions["ExpandNode"] = "ExpandNode";
    TelemetryActions["ResultPaneAction"] = "ResultPaneAction";
})(TelemetryActions || (exports.TelemetryActions = TelemetryActions = {}));

//# sourceMappingURL=telemetryInterfaces.js.map
