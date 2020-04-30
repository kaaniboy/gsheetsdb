// https://stackoverflow.com/questions/19942619/query-specific-sheets-of-a-google-spreadsheet
import SheetsDB from './SheetsDB';
import SheetsResultSet from './SheetsResultSet';

(async () => {
    const db = new SheetsDB('1bf99MxyEbN--R4DR0MDhc0x-6UhxwPnYM1WITm5CIGs');

    db.linkTable({
        tableName: 'users',
        cols: [
            { name: 'id' },
            { name: 'name' },
            { name: 'age'},
            { name: 'dob'}
        ]
    });

    db.linkTable({
        tableName: 'orders',
        cols: [
            { name: 'id' },
            { name: 'user_id' },
            { name: 'name'}
        ]
    });

    const orders = <SheetsResultSet> await db.table('orders').query(
        "SELECT |id|, |user_id|, |name|"
    );
    const users = <SheetsResultSet> await db.table('users').query(
        "SELECT |id|, |name|, |age|, |dob|"
    );
})();