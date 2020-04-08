import SheetsQuery from './SheetsQuery';

export default class SheetsTable {
    constructor(db, schema) {
        this.db = db;
        this.schema = schema;

        this._columnMappings = 
            this._createColumnMappings(schema.cols);
    }

    async query(query) {
        query = query.toLowerCase();
        query = this._appendLabels(query);
        query = this._mapQueryColumnNames(query);

        return await new SheetsQuery(this).run(query);
    }

    _createColumnMappings(cols) {
        const mappings = {};
        let i = 0;
        for (let c of cols) {
            const sheetColName = String.fromCharCode(65 + (i++));
            mappings[c.name] = sheetColName;
        }
        return mappings;
    }

    _mapQueryColumnNames(query) {
        let offset = 0;
        for (let { name } of this.schema.cols) {
            query = query.replace(
                new RegExp(`\\|${name.toLowerCase()}\\|`, 'g'),
                String.fromCharCode(65 + (offset++))
            );
        }
        return query;
    }

    _appendLabels(query) {
        const colsListingStart = 'select'.length;
        let colsListingEnd = query.length;

        for (let term of COLS_LISTING_END) {
            if (query.includes(term)) {
                colsListingEnd = Math.min(colsListingEnd, query.indexOf(term));
            }
        }

        const colsListing = query.substring(
            colsListingStart, 
            colsListingEnd
        ).trim().replace(/\s/g, '').split(',');

        const labels = colsListing.map(col => {
            const extractedCol = col.replace(/\|/g, '');
            return `${col} '${extractedCol}'`;
        }).join(', ')

        return query + ' label ' + labels;
    }
}

const COLS_LISTING_END = [
    'where', 'group by', 'pivot', 
    'order by', 'limit', 'offset', 
    'label', 'format', 'options'
];