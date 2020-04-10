import { SheetsResultSetRow } from "./Types";

export default class SheetsResultSet {
    constructor(public rows: SheetsResultSetRow[]) { }

    leftJoin(other: SheetsResultSet) { }
}