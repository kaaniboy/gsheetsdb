// https://stackoverflow.com/questions/19942619/query-specific-sheets-of-a-google-spreadsheet
const axios = require('axios');

class SheetsDB {
    constructor(sheetId) {
        this.sheetId = sheetId;
        this.tables = {};
    }

    linkTable(schema) {
        this.tables[schema.tableName] = new SheetsTable(this, schema);
    }

    table(name) {
        return this.tables[name];
    }
}

class SheetsTable {
    constructor(db, schema) {
        this._DATA_PREFIX = '/*O_o*/\ngoogle.visualization.Query.setResponse(';
        
        this.db = db;
        this.schema = schema;

        this._columnMappings = 
            this._createColumnMappings(schema.cols);
    }

    async query(query) {
        const url = this._createQueryUrl(
            this._mapQueryColumnNames(query)
        );
        const res = await axios.get(url);
        return this._extractData(res.data);
    }

    _createQueryUrl(query) {
        const tableName = this.schema.tableName;
        const encodedQuery = encodeURIComponent(query);

        return `https://docs.google.com/spreadsheets/d/` +
                `${this.db.sheetId}/gviz/tq?sheet=${tableName}&tq=${encodedQuery}`;
    }

    _extractData(data) {
        const cleanedData = data
            .substring(0, data.length - 2)
            .replace(this._DATA_PREFIX, '');

        return JSON.parse(cleanedData).table;
    }

    _createColumnMappings(cols) {
        const mappings = {};
        let i = 0;
        for (let c of cols) {
            const key = String.fromCharCode(65 + (i++));
            mappings[key] = c.name.toLowerCase();
        }
        return mappings;
    }

    _mapQueryColumnNames(query) {
        query = query.toLowerCase();
        let offset = 0;
        for (let { name } of this.schema.cols) {
            query = query.replace(
                new RegExp(`\\|${name.toLowerCase()}\\|`, 'g'),
                String.fromCharCode(65 + (offset++))
            );
        }
        return query;
    }
}

(async () => {
    const db = new SheetsDB('1bf99MxyEbN--R4DR0MDhc0x-6UhxwPnYM1WITm5CIGs');

    db.linkTable({
        tableName: 'users',
        cols: [
            { name: 'id' },
            { name: 'name' },
            { name: 'age'}
        ]
    });

    const data = await db.table('users').query("SELECT MAX(|id|)");
})();