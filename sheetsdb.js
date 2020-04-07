// https://stackoverflow.com/questions/19942619/query-specific-sheets-of-a-google-spreadsheet
const axios = require('axios');

class SheetsDB {
    constructor(sheetId) {
        this.sheetId = sheetId;
        this.tables = {};
    }

    table(name) {
        if (!this.tables[name]) {
            this.tables[name] = new SheetsTable(this, name);
        }
        return this.tables[name];
    }
}

class SheetsTable {
    constructor(db, name) {
        this._RES_PREFIX = '/*O_o*/\ngoogle.visualization.Query.setResponse(';
        this.db = db;
        this.name = name;
    }

    async query(q) {
        const url = this._constructQueryUrl(q);
        const res = await axios.get(url);
        return this._extractData(res.data);
        
    }

    _constructQueryUrl(q) {
        const encodedQuery = encodeURIComponent(q);
        return `https://docs.google.com/spreadsheets/d/${this.db.sheetId}/gviz/tq?sheet=${this.name}&tq=${encodedQuery}`;
    }

    _extractData(data) {
        const cleanedData = data
            .substring(0, data.length - 2)
            .replace(this._RES_PREFIX, '');

        return JSON.parse(cleanedData).table;
    }
}

(async () => {
    const db = new SheetsDB('1bf99MxyEbN--R4DR0MDhc0x-6UhxwPnYM1WITm5CIGs');
    const data = await db.table('users').query('SELECT id');
    console.log(data.rows[0].c);
})();