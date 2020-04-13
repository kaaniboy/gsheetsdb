import axios from 'axios';
import { queryError } from './SheetsDBErrors';
import SheetsTable from './SheetsTable';
import { SheetsResultSetRow } from './Types';
import SheetsResultSet from './SheetsResultSet';

type Response = { data: string; };
type ResponseTable = {
    cols: [{
        id: string;
        label: string;
        type: string;
    }];
    rows: ResponseTableRow[];
};
type ResponseTableRow = { c: [{ v: number | string; }]; }

export default class SheetsQuery {
    static _DATA_PREFIX = '/*O_o*/\ngoogle.visualization.Query.setResponse(';
    debugMode: boolean;

    constructor(public table: SheetsTable) {
        this.debugMode = table.db.debugMode;
    }

    async run(query: string) {
        const url = this._createQueryUrl(query);

        let res: Response;
        try {
            res = await axios.get(url);
        } catch (e) {
            return queryError(`Request failed: ${e.message}`, query, this.debugMode);
        }
        
        const json = this._extractJson(res.data);
        
        if (json.errors) {
            const message = json.errors[0].detailed_message;
            return queryError(message, query, this.debugMode);
        }

        return this._extractResultSetFromJson(json);
    }

    _createQueryUrl(query: string): string {
        const sheetId = this.table.db.sheetId;
        const tableName = this.table.schema.tableName;
        const encodedQuery = encodeURIComponent(query);

        return `https://docs.google.com/spreadsheets/d/` +
                `${sheetId}/gviz/tq?sheet=${tableName}&tq=${encodedQuery}`;
    }

    _extractJson(data: string): any {
        const cleanedData = data
            .substring(0, data.length - 2)
            .replace(SheetsQuery._DATA_PREFIX, '');
        return JSON.parse(cleanedData);
    }

    _extractResultSetFromJson(json: any): SheetsResultSet {
        const rows = json.table.rows;

        // Handle strange issue where queries sometimes
        // return the header row of labels.
        if (rows.length > 1 && rows[0].c[0] === null) {
            rows.shift();
        }
        
        const labels = json.table.cols.map((c: any) => c.label);
        const labelledRows = this._addRowLabels(rows, labels);
        return new SheetsResultSet(labelledRows);
    }

    _addRowLabels(rows: ResponseTableRow[], labels: string[]): SheetsResultSetRow[] {
        return rows
            .map(r => r.c.map(c => c.v))
            .map(r => {
                const resultSetRow: SheetsResultSetRow = {};
                r.map((v, i) => {
                    resultSetRow[labels[i]] = v;
                });
                return resultSetRow;
            });
    }
}