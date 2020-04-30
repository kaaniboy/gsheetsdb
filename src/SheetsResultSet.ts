import { SheetsResultSetRow } from "./Types";

type ColumnRenamings = { [key: string]: string; };

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
                let matchingRightRow = first(right, rightRow => {
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

    withRenamedColumns(renamings: ColumnRenamings): SheetsResultSet {
        if (!renamings) return this;

        const renamedRows = this.rows.map(r => {
            let renamedRow = {...r};
            for (let [oldName, newName] of Object.entries(renamings)) {
                if (!(oldName in renamedRow)) continue;
                renamedRow[newName] = renamedRow[oldName];
                delete renamedRow[oldName];
            }
            return renamedRow;
        });
        return new SheetsResultSet(this.name, renamedRows);
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

function first(
    resultSet: SheetsResultSet,
    predicate: (r: SheetsResultSetRow) => boolean
): SheetsResultSetRow {
    const first = resultSet.rows.find(predicate);
    return first || null;
}