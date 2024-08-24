"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIssuesForComponent = exports.getDesignerView = exports.getCheckConstraintsTabComponents = exports.getForeignKeysTabComponents = exports.getIndexesTabComponents = exports.getPrimaryKeyTabComponents = exports.getColumnsTabComponents = exports.getAboutTableComponents = void 0;
const tableDesignerInterfaces_1 = require("./tableDesignerInterfaces");
function getAboutTableComponents(viewDefinition) {
    if (!viewDefinition) {
        return [];
    }
    const tabComponents = [
        {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableColumnProperty.Name,
            description: "The name of the table object.",
            componentProperties: {
                title: "Table name",
                width: 350
            }
        },
        {
            componentType: 'dropdown',
            propertyName: tableDesignerInterfaces_1.TableProperty.Schema,
            description: "The schema that contains the table.",
            componentProperties: {
                title: "Schema",
                width: 350,
            }
        },
        {
            componentType: 'textarea',
            propertyName: tableDesignerInterfaces_1.TableProperty.Description,
            description: "Description for the table.",
            componentProperties: {
                title: "Description",
                width: 350
            }
        }
    ];
    if (viewDefinition === null || viewDefinition === void 0 ? void 0 : viewDefinition.additionalTableProperties) {
        tabComponents.push(...viewDefinition.additionalTableProperties);
    }
    return tabComponents;
}
exports.getAboutTableComponents = getAboutTableComponents;
function getColumnsTabComponents(view) {
    var _a;
    if (!view || !(view === null || view === void 0 ? void 0 : view.columnTableOptions)) {
        return [];
    }
    const columnTableOptions = view.columnTableOptions;
    const columnTableColumnDefinitions = [
        {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableColumnProperty.Name,
            description: "The name of the column object.",
            componentProperties: {
                title: "Name",
                width: 150
            }
        }, {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableColumnProperty.Description,
            description: "Displays the description of the column",
            componentProperties: {
                title: "Description",
                width: 400
            }
        }, {
            componentType: 'dropdown',
            propertyName: tableDesignerInterfaces_1.TableColumnProperty.AdvancedType,
            description: "Displays the unified data type (including length, scale and precision) for the column",
            componentProperties: {
                title: "Advanced Type",
                width: 120,
                isEditable: true
            }
        }, {
            componentType: 'dropdown',
            propertyName: tableDesignerInterfaces_1.TableColumnProperty.Type,
            showInPropertiesView: false,
            description: "Displays the data type name for the column",
            componentProperties: {
                title: "Type",
                width: 100
            }
        }, {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableColumnProperty.Length,
            description: "The maximum length (in characters) that can be stored in this database object.",
            componentProperties: {
                title: "Length",
                width: 60
            }
        }, {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableColumnProperty.DefaultValue,
            description: "A predefined global default value for the column or binding.",
            componentProperties: {
                title: "Default Value",
                width: 150
            }
        }, {
            componentType: 'checkbox',
            propertyName: tableDesignerInterfaces_1.TableColumnProperty.AllowNulls,
            description: "Specifies whether the column may have a NULL value.",
            componentProperties: {
                title: "Allow Nulls",
            }
        }, {
            componentType: 'checkbox',
            propertyName: tableDesignerInterfaces_1.TableColumnProperty.IsPrimaryKey,
            description: "Specifies whether the column is included in the primary key for the table.",
            componentProperties: {
                title: "Primary Key",
            }
        }, {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableColumnProperty.Precision,
            description: "For numeric data, the maximum number of decimal digits that can be stored in this database object.",
            componentProperties: {
                title: "Precision",
                width: 60,
                inputType: tableDesignerInterfaces_1.InputType.Number
            }
        }, {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableColumnProperty.Scale,
            description: "For numeric data, the maximum number of decimal digits that can be stored in this database object to the right of decimal point.",
            componentProperties: {
                title: "Scale",
                width: 60,
                inputType: tableDesignerInterfaces_1.InputType.Number
            }
        }
    ];
    const displayProperties = getTableDisplayProperties(columnTableOptions, [
        tableDesignerInterfaces_1.TableColumnProperty.Name,
        tableDesignerInterfaces_1.TableColumnProperty.AdvancedType,
        tableDesignerInterfaces_1.TableColumnProperty.IsPrimaryKey,
        tableDesignerInterfaces_1.TableColumnProperty.AllowNulls,
        tableDesignerInterfaces_1.TableColumnProperty.DefaultValue,
    ]);
    const tabComponents = [
        {
            componentType: 'table',
            propertyName: tableDesignerInterfaces_1.TableProperty.Columns,
            showInPropertiesView: false,
            componentProperties: {
                ariaLabel: "Columns",
                columns: displayProperties,
                itemProperties: addAdditionalTableProperties(columnTableOptions, columnTableColumnDefinitions),
                objectTypeDisplayName: "Column",
                canAddRows: columnTableOptions.canAddRows,
                canInsertRows: columnTableOptions.canInsertRows,
                canMoveRows: columnTableOptions.canMoveRows,
                canRemoveRows: columnTableOptions.canRemoveRows,
                removeRowConfirmationMessage: columnTableOptions.removeRowConfirmationMessage,
                showRemoveRowConfirmation: columnTableOptions.showRemoveRowConfirmation,
                labelForAddNewButton: (_a = columnTableOptions.labelForAddNewButton) !== null && _a !== void 0 ? _a : "New Column"
            }
        },
    ];
    const additionalComponents = getAdditionalComponentsForTab(tableDesignerInterfaces_1.TableProperty.Columns, view.additionalComponents);
    if (additionalComponents) {
        tabComponents.push(...additionalComponents);
    }
    return tabComponents;
}
exports.getColumnsTabComponents = getColumnsTabComponents;
function getPrimaryKeyTabComponents(view) {
    var _a;
    if (!view || !view.primaryKeyColumnSpecificationTableOptions) {
        return [];
    }
    const columnSpecProperties = [
        {
            componentType: 'dropdown',
            propertyName: tableDesignerInterfaces_1.TableIndexColumnSpecificationProperty.Column,
            description: "The name of the column.",
            componentProperties: {
                title: "Column",
                width: 150
            }
        }
    ];
    const tabComponents = [
        {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableProperty.PrimaryKeyName,
            showInPropertiesView: false,
            description: "Name of the primary key.",
            componentProperties: {
                title: "Name",
                width: 250
            }
        },
        {
            componentType: 'textarea',
            propertyName: tableDesignerInterfaces_1.TableProperty.PrimaryKeyDescription,
            showInPropertiesView: false,
            description: "The description of the primary key.",
            componentProperties: {
                title: "Description",
                width: 250
            }
        }
    ];
    if (view.additionalPrimaryKeyProperties) {
        view.additionalPrimaryKeyProperties.forEach(component => {
            const copy = Object.assign({}, component);
            copy.showInPropertiesView = false;
            tabComponents.push(copy);
        });
    }
    const primaryKeyTableOptions = view.primaryKeyColumnSpecificationTableOptions;
    if (primaryKeyTableOptions) {
        tabComponents.push({
            componentType: 'table',
            propertyName: tableDesignerInterfaces_1.TableProperty.PrimaryKeyColumns,
            showInPropertiesView: false,
            description: "Columns in the primary key.",
            componentProperties: {
                title: "Primary Key Columns",
                ariaLabel: "Primary Key Columns",
                columns: getTableDisplayProperties(primaryKeyTableOptions, [tableDesignerInterfaces_1.TableIndexColumnSpecificationProperty.Column]),
                itemProperties: addAdditionalTableProperties(primaryKeyTableOptions, columnSpecProperties),
                objectTypeDisplayName: '',
                canAddRows: primaryKeyTableOptions.canAddRows,
                canRemoveRows: primaryKeyTableOptions.canRemoveRows,
                removeRowConfirmationMessage: primaryKeyTableOptions.removeRowConfirmationMessage,
                showRemoveRowConfirmation: primaryKeyTableOptions.showRemoveRowConfirmation,
                showItemDetailInPropertiesView: false,
                labelForAddNewButton: (_a = primaryKeyTableOptions.labelForAddNewButton) !== null && _a !== void 0 ? _a : "Add Column",
                canMoveRows: primaryKeyTableOptions.canMoveRows
            }
        });
    }
    const additionalComponents = getAdditionalComponentsForTab(tableDesignerInterfaces_1.TableProperty.PrimaryKey, view.additionalComponents);
    if (additionalComponents) {
        tabComponents.push(...additionalComponents);
    }
    return tabComponents;
}
exports.getPrimaryKeyTabComponents = getPrimaryKeyTabComponents;
function getIndexesTabComponents(view) {
    var _a, _b;
    if (!view || !view.indexTableOptions) {
        return [];
    }
    const indexTableOptions = view.indexTableOptions;
    const columnSpecTableOptions = view.indexColumnSpecificationTableOptions;
    const columnSpecProperties = [
        {
            componentType: 'dropdown',
            propertyName: tableDesignerInterfaces_1.TableIndexColumnSpecificationProperty.Column,
            description: "The name of the column.",
            componentProperties: {
                title: "Column",
                width: 100
            }
        }
    ];
    const indexProperties = [
        {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableIndexProperty.Name,
            description: "The name of the index.",
            componentProperties: {
                title: "Name",
                width: 200
            }
        }, {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableIndexProperty.Description,
            description: "The description of the index.",
            componentProperties: {
                title: "Description",
                width: 200
            }
        }
    ];
    if (columnSpecTableOptions) {
        indexProperties.push({
            componentType: 'table',
            propertyName: tableDesignerInterfaces_1.TableIndexProperty.Columns,
            description: "The columns of the index.",
            group: "Columns",
            componentProperties: {
                ariaLabel: "Columns",
                columns: getTableDisplayProperties(columnSpecTableOptions, [tableDesignerInterfaces_1.TableIndexColumnSpecificationProperty.Column]),
                itemProperties: addAdditionalTableProperties(columnSpecTableOptions, columnSpecProperties),
                objectTypeDisplayName: '',
                canAddRows: columnSpecTableOptions.canAddRows,
                canRemoveRows: columnSpecTableOptions.canRemoveRows,
                removeRowConfirmationMessage: columnSpecTableOptions.removeRowConfirmationMessage,
                showRemoveRowConfirmation: columnSpecTableOptions.showRemoveRowConfirmation,
                labelForAddNewButton: (_a = columnSpecTableOptions.labelForAddNewButton) !== null && _a !== void 0 ? _a : "Add Column"
            }
        });
    }
    const tabComponents = [];
    if (indexTableOptions) {
        tabComponents.push({
            componentType: 'table',
            propertyName: tableDesignerInterfaces_1.TableProperty.Indexes,
            showInPropertiesView: false,
            componentProperties: {
                ariaLabel: "Indexes",
                columns: getTableDisplayProperties(indexTableOptions, [tableDesignerInterfaces_1.TableIndexProperty.Name]),
                itemProperties: addAdditionalTableProperties(indexTableOptions, indexProperties),
                objectTypeDisplayName: "Index",
                canAddRows: indexTableOptions.canAddRows,
                canRemoveRows: indexTableOptions.canRemoveRows,
                removeRowConfirmationMessage: indexTableOptions.removeRowConfirmationMessage,
                showRemoveRowConfirmation: indexTableOptions.showRemoveRowConfirmation,
                labelForAddNewButton: (_b = indexTableOptions.labelForAddNewButton) !== null && _b !== void 0 ? _b : "New Index"
            }
        });
    }
    const additionalComponents = getAdditionalComponentsForTab(tableDesignerInterfaces_1.TableProperty.Indexes, view.additionalComponents);
    if (additionalComponents) {
        tabComponents.push(...additionalComponents);
    }
    return tabComponents;
}
exports.getIndexesTabComponents = getIndexesTabComponents;
function getForeignKeysTabComponents(view) {
    var _a, _b;
    if (!view || !view.foreignKeyTableOptions) {
        return [];
    }
    const foreignKeyTableOptions = view.foreignKeyTableOptions;
    const columnMappingTableOptions = view.foreignKeyColumnMappingTableOptions;
    const foreignKeyColumnMappingProperties = [
        {
            componentType: 'dropdown',
            propertyName: tableDesignerInterfaces_1.ForeignKeyColumnMappingProperty.ForeignColumn,
            componentProperties: {
                title: "Foreign Column",
                width: 150
            }
        },
        {
            componentType: 'dropdown',
            propertyName: tableDesignerInterfaces_1.ForeignKeyColumnMappingProperty.Column,
            componentProperties: {
                title: "Column",
                width: 150
            }
        },
    ];
    const foreignKeyProperties = [
        {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableForeignKeyProperty.Name,
            description: "The name of the foreign key.",
            componentProperties: {
                title: "Name",
                width: 300
            }
        },
        {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableForeignKeyProperty.Description,
            description: "The description of the foreign key.",
            componentProperties: {
                title: "Description",
            }
        },
        {
            componentType: 'dropdown',
            propertyName: tableDesignerInterfaces_1.TableForeignKeyProperty.ForeignTable,
            description: "The table which contains the primary or unique key column.",
            componentProperties: {
                title: "Foreign Table",
                width: 200
            }
        },
        {
            componentType: 'dropdown',
            propertyName: tableDesignerInterfaces_1.TableForeignKeyProperty.OnUpdateAction,
            description: "The behavior when a user tries to update a row with data that is involved in a foreign key relationship.",
            componentProperties: {
                title: "On Update Action",
                width: 100
            }
        },
        {
            componentType: 'dropdown',
            propertyName: tableDesignerInterfaces_1.TableForeignKeyProperty.OnDeleteAction,
            description: "The behavior when a user tries to delete a row with data that is involved in a foreign key relationship.",
            componentProperties: {
                title: "On Delete Action",
                width: 100
            }
        },
    ];
    if (columnMappingTableOptions) {
        foreignKeyProperties.push({
            componentType: 'table',
            propertyName: tableDesignerInterfaces_1.TableForeignKeyProperty.Columns,
            description: "The mapping between foreign key columns and primary key columns.",
            group: "Columns",
            componentProperties: {
                ariaLabel: "Columns",
                columns: getTableDisplayProperties(columnMappingTableOptions, [tableDesignerInterfaces_1.ForeignKeyColumnMappingProperty.Column, tableDesignerInterfaces_1.ForeignKeyColumnMappingProperty.ForeignColumn]),
                itemProperties: addAdditionalTableProperties(columnMappingTableOptions, foreignKeyColumnMappingProperties),
                canAddRows: columnMappingTableOptions.canAddRows,
                canRemoveRows: columnMappingTableOptions.canRemoveRows,
                removeRowConfirmationMessage: columnMappingTableOptions.removeRowConfirmationMessage,
                labelForAddNewButton: (_a = columnMappingTableOptions.labelForAddNewButton) !== null && _a !== void 0 ? _a : "New Column Mapping"
            }
        });
    }
    const tabComponents = [];
    if (foreignKeyTableOptions) {
        tabComponents.push({
            componentType: 'table',
            propertyName: tableDesignerInterfaces_1.TableProperty.ForeignKeys,
            showInPropertiesView: false,
            componentProperties: {
                ariaLabel: "Foreign Keys",
                columns: getTableDisplayProperties(foreignKeyTableOptions, [tableDesignerInterfaces_1.TableForeignKeyProperty.Name, tableDesignerInterfaces_1.TableForeignKeyProperty.ForeignTable]),
                itemProperties: addAdditionalTableProperties(foreignKeyTableOptions, foreignKeyProperties),
                objectTypeDisplayName: "Foreign Key",
                canAddRows: foreignKeyTableOptions.canAddRows,
                canRemoveRows: foreignKeyTableOptions.canRemoveRows,
                removeRowConfirmationMessage: foreignKeyTableOptions.removeRowConfirmationMessage,
                showRemoveRowConfirmation: foreignKeyTableOptions.showRemoveRowConfirmation,
                labelForAddNewButton: (_b = foreignKeyTableOptions.labelForAddNewButton) !== null && _b !== void 0 ? _b : "New Foreign Key"
            }
        });
    }
    const additionalComponents = getAdditionalComponentsForTab(tableDesignerInterfaces_1.TableProperty.ForeignKeys, view.additionalComponents);
    if (additionalComponents) {
        tabComponents.push(...additionalComponents);
    }
    return tabComponents;
}
exports.getForeignKeysTabComponents = getForeignKeysTabComponents;
function getCheckConstraintsTabComponents(view) {
    var _a;
    if (!view || !view.checkConstraintTableOptions) {
        return [];
    }
    const checkConstraintTableOptions = view.checkConstraintTableOptions;
    const additionalcomponents = view.additionalComponents || [];
    const checkConstraintProperties = [
        {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableCheckConstraintProperty.Name,
            description: "The name of the check constraint.",
            componentProperties: {
                title: "Name",
                width: 200
            }
        }, {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableCheckConstraintProperty.Description,
            description: "The description of the check constraint.",
            componentProperties: {
                title: "Description",
            }
        }, {
            componentType: 'input',
            propertyName: tableDesignerInterfaces_1.TableCheckConstraintProperty.Expression,
            description: "The expression defining the check constraint.",
            componentProperties: {
                title: "Expression",
                width: 300
            }
        }
    ];
    const tabComponents = [];
    if (checkConstraintTableOptions) {
        tabComponents.push({
            componentType: 'table',
            propertyName: tableDesignerInterfaces_1.TableProperty.CheckConstraints,
            showInPropertiesView: false,
            componentProperties: {
                ariaLabel: "Check Constraints",
                columns: getTableDisplayProperties(checkConstraintTableOptions, [tableDesignerInterfaces_1.TableCheckConstraintProperty.Name, tableDesignerInterfaces_1.TableCheckConstraintProperty.Expression]),
                itemProperties: addAdditionalTableProperties(checkConstraintTableOptions, checkConstraintProperties),
                objectTypeDisplayName: "Check Constraint",
                canAddRows: checkConstraintTableOptions.canAddRows,
                canRemoveRows: checkConstraintTableOptions.canRemoveRows,
                removeRowConfirmationMessage: checkConstraintTableOptions.removeRowConfirmationMessage,
                showRemoveRowConfirmation: checkConstraintTableOptions.showRemoveRowConfirmation,
                labelForAddNewButton: (_a = checkConstraintTableOptions.labelForAddNewButton) !== null && _a !== void 0 ? _a : "New Check Constraint"
            }
        });
    }
    const additionalComponents = getAdditionalComponentsForTab(tableDesignerInterfaces_1.TableProperty.CheckConstraints, additionalcomponents);
    if (additionalComponents) {
        tabComponents.push(...additionalComponents);
    }
    return tabComponents;
}
exports.getCheckConstraintsTabComponents = getCheckConstraintsTabComponents;
function getDesignerView(view) {
    return {
        tabs: [
            {
                title: "About table",
                id: tableDesignerInterfaces_1.DesignerMainPaneTabs.AboutTable,
                components: getAboutTableComponents(view)
            },
            {
                title: "Columns",
                id: tableDesignerInterfaces_1.DesignerMainPaneTabs.Columns,
                components: getColumnsTabComponents(view)
            },
            {
                title: "Primary Key",
                id: tableDesignerInterfaces_1.DesignerMainPaneTabs.PrimaryKey,
                components: getPrimaryKeyTabComponents(view)
            },
            {
                title: "Indexes",
                id: tableDesignerInterfaces_1.DesignerMainPaneTabs.Indexes,
                components: getIndexesTabComponents(view)
            },
            {
                title: "Foreign Keys",
                id: tableDesignerInterfaces_1.DesignerMainPaneTabs.ForeignKeys,
                components: getForeignKeysTabComponents(view)
            },
            {
                title: "Check Constraints",
                id: tableDesignerInterfaces_1.DesignerMainPaneTabs.CheckConstraints,
                components: getCheckConstraintsTabComponents(view)
            }
        ]
    };
}
exports.getDesignerView = getDesignerView;
function getTableDisplayProperties(options, defaultProperties) {
    if (!options) {
        return defaultProperties;
    }
    return (options.propertiesToDisplay.length > 0 ? options.propertiesToDisplay : defaultProperties) || [];
}
function addAdditionalTableProperties(options, properties) {
    if (options.additionalProperties) {
        properties.push(...options.additionalProperties);
    }
    return properties;
}
function getAdditionalComponentsForTab(tabId, additionalComponents) {
    if (additionalComponents) {
        return additionalComponents.filter(c => c.tab === tabId);
    }
    return [];
}
function getIssuesForComponent(componentPath, issues) {
    if (!issues || issues.length === 0) {
        return "";
    }
    return issues.filter(i => { var _a; return ((_a = i.propertyPath) === null || _a === void 0 ? void 0 : _a.toString()) === componentPath.toString(); }).reduce((acc, issue) => {
        return acc + issue.description + " ";
    }, "");
}
exports.getIssuesForComponent = getIssuesForComponent;

//# sourceMappingURL=tableDesignerTabDefinition.js.map
