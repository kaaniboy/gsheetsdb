export interface SheetsTableSchema {
    tableName: string;
    cols: SheetsTableColumn[];
}

export interface SheetsTableColumn {
    name: string;
}