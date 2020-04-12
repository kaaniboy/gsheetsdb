import SheetsQuery from './SheetsQuery';
import SheetsDB from './SheetsDB';
import { SheetsTableSchema, SheetsTableColumn } from './Types';

type ColumnMappings = {[key: string]: string; };

export default class SheetsTable {
    _columnMappings: ColumnMappings;
    
    constructor(
        public db: SheetsDB,
        public schema: SheetsTableSchema
    ) {
        this._columnMappings = 
            this._createColumnMappings(schema.cols);
    }

    async query(query: string) {
        query = query.toLowerCase() 
            + ' label ' + this._createLabelsListing(query);
        query = this._mapQueryColumnNames(query);

        return await new SheetsQuery(this).run(query);
    }

    _createColumnMappings(cols: SheetsTableColumn[] ): ColumnMappings {
        const mappings: ColumnMappings = {};
        let i = 0;

        for (let c of cols) {
            const sheetColName = String.fromCharCode(65 + (i++));
            mappings[c.name] = sheetColName;
        }
        
        return mappings;
    }

    _mapQueryColumnNames(query: string): string {
        let offset = 0;
        for (let { name } of this.schema.cols) {
            query = query.replace(
                new RegExp(`\\|${name.toLowerCase()}\\|`, 'g'),
                String.fromCharCode(65 + (offset++))
            );
        }
        return query;
    }

    _createLabelsListing(query: string): string {
        return this._createLabels(query).join(', ')
    }

    _createLabels(query: string): string[] {
        const colsListing = this._extractColsListing(query);
        return colsListing.map(col => {
            const extractedCol = col.replace(/\|/g, '');
            return `${col} '${extractedCol}'`;
        })
    }

    _extractColsListing(query: string): string[] {
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
        ).trim().replace(/\s/g, '');

        if (colsListing.length === 0) {
            return [];
        }
        return colsListing.split(',');
    }
}

const COLS_LISTING_END = [
    'where', 'group by', 'pivot', 
    'order by', 'limit', 'offset', 
    'label', 'format', 'options'
];