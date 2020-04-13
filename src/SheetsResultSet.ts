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

        const joinedRows = this.rows.map(leftRow => {
            const matchingRightRow = right.first(rightRow => {
                return leftRow[leftCol] === rightRow[rightCol];
            });

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
            prefixedRow[`${resultSetName}.${k}`] = row[k];
        } else {
            prefixedRow[k] = row[k];
        }
    }

    return prefixedRow;
}