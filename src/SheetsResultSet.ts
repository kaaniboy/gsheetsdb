import { SheetsResultSetRow } from "./Types";

export default class SheetsResultSet {
    constructor(
        public name: string,
        public rows: SheetsResultSetRow[]
    ) { }

    leftJoinWith(
        right: SheetsResultSet,
        leftCol: string,
        rightCol: string
    ): SheetsResultSet {
        const duplicateColumns = getDuplicateColumns(
            [...this.getColumns(), ...right.getColumns()]
        );
        duplicateColumns.delete(rightCol);

        const joinedRows = this.rows
            .map(leftRow => {
                let matchingRightRow = right.first(rightRow => {
                    return leftRow[leftCol] === rightRow[rightCol];
                }) || createEmptyRow(right.getColumns());
                
                // Remove redundant join column in right table
                matchingRightRow = {...matchingRightRow};
                delete matchingRightRow[rightCol];

                return {
                    ...prefixColumns(this.name, leftRow, duplicateColumns),
                    ...prefixColumns(right.name, matchingRightRow, duplicateColumns)
                };
            });

        return new SheetsResultSet(this.name, joinedRows);
    }

    getColumns(): string[] {
        if (!this.rows || this.rows.length === 0) {
            return [];
        }
        return Object.keys(this.rows[0]);
    }

    first(predicate: (r: SheetsResultSetRow) => boolean): SheetsResultSetRow {
        const first = this.rows.find(r => {
            return predicate(r);
        });
        return first || null;
    }

    filter(predicate: (r: SheetsResultSetRow) => boolean): SheetsResultSet {
        const filteredRows = this.rows.filter(predicate);
        return new SheetsResultSet(this.name, filteredRows);
    }

    size(): number {
        return this.rows.length;
    }
}

function getDuplicateColumns(
    columns: string[]
): Set<string> {
    if (!columns) {
        return new Set();
    }

    let columnSet = new Set<string>();
    let duplicates = new Set<string>();

    for (let c of columns) {
        if (columnSet.has(c)) {
            duplicates.add(c);
        }
        columnSet.add(c);
    }
    return duplicates;
}

function prefixColumns(
    resultSetName: string,
    row: SheetsResultSetRow,
    duplicateColumns: Set<string>
): SheetsResultSetRow {
    if (!row) {
        return null;
    }

    const prefixedRow: SheetsResultSetRow = {};
    const keys= Object.keys(row);

    for (let k of keys) {
        if (duplicateColumns.has(k)) {
            prefixedRow[`${resultSetName}_${k}`] = row[k];
        } else {
            prefixedRow[k] = row[k];
        }
    }

    return prefixedRow;
}

function createEmptyRow(
    columns: string[]
): SheetsResultSetRow {
    let emptyRow: SheetsResultSetRow = {};
    columns.forEach(c => emptyRow[c] = null);
    return emptyRow;
}