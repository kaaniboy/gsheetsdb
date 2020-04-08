import SheetsTable from './SheetsTable';

export default class SheetsDB {
    constructor(sheetId, debugMode=true) {
        this.sheetId = sheetId;
        this.debugMode = debugMode;
        this.tables = {};
    }

    linkTable(schema) {
        this.tables[schema.tableName] = new SheetsTable(this, schema);
    }

    table(name) {
        return this.tables[name];
    }
}