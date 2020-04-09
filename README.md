# SheetsDB.js 💾

A JavaScript library for interacting with a Google Sheets spreadsheet as if it were a relational database.

## Examples

#### Connect to a database

```
// Create a database using the id of the Google Spreadsheet
const db = new SheetsDB('<SPREADSHEET_ID>');
```

#### Link a table to the database
```
// Link the 'users' table to the database
db.linkTable({
    tableName: 'users',
    cols: [
        { name: 'id' }, // id column
        { name: 'name' }, // name column
        { name: 'age'} // age column
    ]
});
```

#### Perform a query
```
const resultSet = await db.table('users').query(
    "SELECT |age|, |id|, |name|"
);

/**
 *  Result Set:
 *  {
 *    rows: [
 *      { id: 1, name: "Bob", age: 25 },
 *      { id: 2, name: "Alice", age: 24 }
 *    ]
 *  }
 */
```
