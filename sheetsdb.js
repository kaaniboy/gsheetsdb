// https://stackoverflow.com/questions/19942619/query-specific-sheets-of-a-google-spreadsheet
const axios = require('axios');

class SheetsDB {
    constructor(sheetId, debugMode=false) {
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

        let res;
        try {
            res = await axios.get(url);
        } catch (e) {
            return this._error(`Request failed: ${e.message}`, query);
        }
        
        const json = this._extractJson(res.data);
        
        if (json.errors) {
            const message = data.errors[0].detailed_message;
            return this._error(message, query);
        }

        return this._extractRowsFromJson(json);
    }

    _createQueryUrl(query) {
        const tableName = this.schema.tableName;
        const encodedQuery = encodeURIComponent(query);

        return `https://docs.google.com/spreadsheets/d/` +
                `${this.db.sheetId}/gviz/tq?sheet=${tableName}&tq=${encodedQuery}`;
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
        return rows.map(r => r.c.map(c => c.v));
    }

    _createColumnMappings(cols) {
        const mappings = {};
        let i = 0;
        for (let c of cols) {
            const sheetColName = String.fromCharCode(65 + (i++));
            mappings[c.name.toLowerCase()] = sheetColName;
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

    _error(message, query) {
        if (this.db.debugMode) {
            console.error(query + '\n' + message);
        }
        return {
            query: query,
            error: message
        };
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

    const data = await db.table('users').query("SELECT |id|, |name|, |age|");
    console.log(data);
})();