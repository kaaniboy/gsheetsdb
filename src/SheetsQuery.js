import axios from 'axios';
import { queryError } from './SheetsDBErrors';

export default class SheetsQuery {
    constructor(table) {
        this._DATA_PREFIX = '/*O_o*/\ngoogle.visualization.Query.setResponse(';

        this.table = table;
        this.debugMode = table.db.debugMode;
    }

    async run(query) {
        const url = this._createQueryUrl(query);

        let res;
        try {
            res = await axios.get(url);
        } catch (e) {
            return queryError(`Request failed: ${e.message}`, query, this.debugMode);
        }
        
        const json = this._extractJson(res.data);
        
        if (json.errors) {
            const message = json.errors[0].detailed_message;
            return queryError(message, this.debugMode);
        }

        return this._extractRowsFromJson(json);
    }

    _createQueryUrl(query) {
        const sheetId = this.table.db.sheetId;
        const tableName = this.table.schema.tableName;
        const encodedQuery = encodeURIComponent(query);

        return `https://docs.google.com/spreadsheets/d/` +
                `${sheetId}/gviz/tq?sheet=${tableName}&tq=${encodedQuery}`;
    }

    _extractJson(data) {
        const cleanedData = data
            .substring(0, data.length - 2)
            .replace(this._DATA_PREFIX, '');

        return JSON.parse(cleanedData);
    }

    _extractRowsFromJson(json) {
        const rows = json.table.rows;
        if (rows.length === 0) {
            return rows;
        }
        rows.shift();
        
        const labels = json.table.cols.map(c => c.label);
        const labelledRows = this._addRowLabels(rows, labels);
        return labelledRows;
    }

    _addRowLabels(rows, labels) {
        return rows
            .map(r => r.c.map(c => c.v))
            .map(r => {
                const labelledRow = {};
                r.map((v, i) => {
                    labelledRow[labels[i]] = v;
                });
                return labelledRow;
            });
    }
}