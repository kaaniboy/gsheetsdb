import SheetsTable from './SheetsTable';
import { SheetsTableSchema } from './SheetsTableSchema';

type Tables = { [key: string]: SheetsTable; };

export default class SheetsDB {
    sheetId: string;
    debugMode: boolean;
    tables: Tables;

    constructor(sheetId: string, debugMode = true) {
        this.sheetId = sheetId;
        this.debugMode = debugMode;
        this.tables = {};
    }

    linkTable(schema: SheetsTableSchema) {
        this.tables[schema.tableName] = new SheetsTable(this, schema);
    }

    table(name: string) {
        return this.tables[name];
    }
}