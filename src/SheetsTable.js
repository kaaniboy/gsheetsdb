import SheetsQuery from './SheetsQuery';

export default class SheetsTable {
    constructor(db, schema) {
        this.db = db;
        this.schema = schema;

        this._columnMappings = 
            this._createColumnMappings(schema.cols);
    }

    async query(query) {
        query = this._mapQueryColumnNames(query);
        return await new SheetsQuery(this).run(query);
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
}