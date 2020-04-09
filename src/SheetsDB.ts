import SheetsTable from './SheetsTable';
import { SheetsTableSchema } from './Types';

type Tables = { [key: string]: SheetsTable; };

export default class SheetsDB {
    tables: Tables;

    constructor(public sheetId: string, public debugMode = true) {
        this.tables = {};
    }

    linkTable(schema: SheetsTableSchema) {
        this.tables[schema.tableName] = new SheetsTable(this, schema);
    }

    table(name: string): SheetsTable {
        return this.tables[name];
    }
}