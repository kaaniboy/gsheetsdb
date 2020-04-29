import SheetsQuery from './SheetsQuery';
import SheetsDB from './SheetsDB';
import { SheetsTableSchema, SheetsTableColumn } from './Types';

export default class SheetsTable {
    constructor(
        public db: SheetsDB,
        public schema: SheetsTableSchema
    ) { }

    async query(query: string) {
        query = this._prepareQuery(query);

        return await new SheetsQuery(this).run(query);
    }

    _prepareQuery(query: string): string {
        const labelsListing = createLabelsListing(query);
        if (labelsListing.length === 0) {
            return '';
        }
        query = query.toLowerCase() 
            + ' label ' + labelsListing;
        return mapQueryColumnNames(query, this);
    }
}

const COLS_LISTING_END = [
    'where', 'group by', 'pivot', 
    'order by', 'limit', 'offset', 
    'label', 'format', 'options'
];

function mapQueryColumnNames(query: string, table: SheetsTable): string {
    let offset = 0;
    for (let { name } of table.schema.cols) {
        query = query.replace(
            new RegExp(`\\|${name.toLowerCase()}\\|`, 'g'),
            String.fromCharCode(65 + (offset++))
        );
    }
    return query;
}

function createLabelsListing(query: string): string {
    return createLabels(query).join(', ')
}

function createLabels(query: string): string[] {
    const colsListing = extractColsListing(query);
    return colsListing.map(col => {
        const extractedCol = col.replace(/\|/g, '');
        return `${col} '${extractedCol}'`;
    });
}

function extractColsListing(query: string): string[] {
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