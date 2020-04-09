export interface SheetsTableSchema {
    tableName: string;
    cols: SheetsTableColumn[];
}

export interface SheetsTableColumn {
    name: string;
}

export interface SheetsResultSet {
    rows: SheetsResultSetRow[];
}

export interface SheetsResultSetRow {
    [key: string]: number | string;
}