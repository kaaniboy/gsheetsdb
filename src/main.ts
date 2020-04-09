// https://stackoverflow.com/questions/19942619/query-specific-sheets-of-a-google-spreadsheet
import SheetsDB from './SheetsDB';

(async () => {
    const db = new SheetsDB('1bf99MxyEbN--R4DR0MDhc0x-6UhxwPnYM1WITm5CIGs');

    db.linkTable({
        tableName: 'users',
        cols: [
            { name: 'id' },
            { name: 'name' },
            { name: 'age'}
        ]
    });

    const data = await db.table('users').query(
        "SELECT |age|, |id|, |name|"
    );
    console.log(data);
})();