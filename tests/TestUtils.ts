import SheetsDB from '../src/SheetsDB';

const TEST_SHEET_ID = '1bf99MxyEbN--R4DR0MDhc0x-6UhxwPnYM1WITm5CIGs';

const db = new SheetsDB(TEST_SHEET_ID);
db.linkTable({
    tableName: 'users',
    cols: [
        { name: 'id' },
        { name: 'name' },
        { name: 'age'}
    ]
});

const usersTable = db.tables.users;

export {
    db,
    usersTable
};