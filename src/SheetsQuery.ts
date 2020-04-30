import axios from 'axios';
import { queryError } from './SheetsDBErrors';
import SheetsTable from './SheetsTable';
import { SheetsResultSetRow } from './Types';
import SheetsResultSet from './SheetsResultSet';

type Response = { data: string; };
type ResponseTableRow = { c: [{ v: number | string; }]; }

export default class SheetsQuery {
    debugMode: boolean;

    constructor(public table: SheetsTable) {
        this.debugMode = table.db.debugMode;
    }

    async run(query: string) {
        const url = createQueryUrl(query, this.table);

        let res: Response;
        try {
            res = await axios.get(url);
        } catch (e) {
            return queryError(`Request failed: ${e.message}`, query, this.debugMode);
        }
        
        const json = extractJson(res.data);
         
        if (json.errors) {
            const message = json.errors[0].detailed_message;
            return queryError(message, query, this.debugMode);
        }
        return extractResultSetFromJson(json, this.table);
    }
}

const DATA_PREFIX = '/*O_o*/\ngoogle.visualization.Query.setResponse(';
const DATETIME_PREFIX = 'Date(';

function createQueryUrl(query: string, table: SheetsTable): string {
    const sheetId = table.db.sheetId;
    const tableName = table.schema.tableName;
    const encodedQuery = encodeURIComponent(query);

    return `https://docs.google.com/spreadsheets/d/` +
            `${sheetId}/gviz/tq?sheet=${tableName}&tq=${encodedQuery}`;
}

function extractJson(data: string): any {
    const cleanedData = data
        .substring(0, data.length - 2)
        .replace(DATA_PREFIX, '');
    return JSON.parse(cleanedData);
}

function extractResultSetFromJson(json: any, table: SheetsTable): SheetsResultSet {
    const rows = json.table.rows;

    // Handle strange issue where queries sometimes
    // return the header row of labels.
    if (rows.length > 1 && rows[0].c[0] === null) {
        rows.shift();
    }
    
    const labels = json.table.cols.map((c: any) => c.label);
    const resultSetName = table.schema.tableName;
    
    const transformedRows = transformRows(rows, labels);
    return new SheetsResultSet(resultSetName, transformedRows);
}

function transformRows(
    rows: ResponseTableRow[],
    labels: string[]
): SheetsResultSetRow[] {
    return rows
        // Handle empty cells
        .map(r => r.c.map(c => c !== null ? c.v : null))
        // Parse dates 
        .map(r => r.map(c => isDate(c) ? parseDate(c) : c))
        .map(r => {
            const resultSetRow: SheetsResultSetRow = {};
            r.map((v, i) => {
                resultSetRow[labels[i]] = v;
            });
            return resultSetRow;
        });
}

function isDate(data: any): boolean {
    return typeof data === 'string' 
        && data.startsWith(DATETIME_PREFIX) 
        && data.endsWith(')');
}

function parseDate(date: any): Date {
    date = date
        .replace(DATETIME_PREFIX, '')
        .replace(')', '')
        .trim();
    const dateArgs: [number, number, number, number, number, number, number]
        = date.split(',').map((v: any) => +v);
    return new Date(...dateArgs);
}