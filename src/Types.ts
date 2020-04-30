export interface SheetsTableSchema {
    tableName: string;
    cols: SheetsTableColumn[];
}

export interface SheetsTableColumn {
    name: string;
}

export interface SheetsResultSetRow {
    [key: string]: number | string | Date;
}