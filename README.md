# SheetsDB 💾

![Tests](https://github.com/kaaniboy/sheetsDB.js/workflows/Tests/badge.svg)

A JavaScript library for interacting with a Google Sheets spreadsheet as if it were a relational database, supporting complex queries with aggregate functions and joins. 

Ideal for static websites that need to display dynamic data. 

---

## Installation

```shell
npm install sheetsdb
```

## Setup

#### Requirements

A database is a spreadsheet in Google Sheets with the following properties:
- Each worksheet in the spreadsheet represents a table
- The worksheet name corresponds to the table name
- The first row of each worksheet contains the table's column names
- Table data is in the left-most columns of the worksheet
- The spreadsheet has public link sharing enabled

[Here](https://docs.google.com/spreadsheets/d/1bf99MxyEbN--R4DR0MDhc0x-6UhxwPnYM1WITm5CIGs) is an example 
spreadsheet meeting the requirements for SheetsDB.

#### Connect

SheetsDB connects to a database via it's `spreadsheet ID`, which can be found in the Google Sheets URL:

```shell
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

With the `spreadsheet ID`, connecting to the database is as simple as the following:
```
const db = new SheetsDB('<SPREADSHEET_ID>');
```

#### Link a table

To interact with tables in the database, you must first link the table. When linking, it is 
important to list columns in the order they appear in the spreadsheet.

```
db.linkTable({
    tableName: 'orders',
    cols: [
        { name: 'id' },
        { name: 'product' },
        { name: 'price'}
    ]
});
```

## Querying

SheetsDB provides a SQL-like query language. More specifically, it supports the 
[Charts Query Language](https://developers.google.com/chart/interactive/docs/querylanguage).

When writing queries, column names should be wrapped in pipes, such as `|column_name|`. 
Below is a simple query:

```
const resultSet = await db.table('orders').query(
    "SELECT |ide|, |product|, |price|"
);
```

The language also supports queries with aggregate functions:

```
const resultSet = await db.table('orders').query(
    "SELECT MAX(|price|)"
);
```

Queries return a result set with a `rows` properties containing the queried data:
```
{
    rows: [
        { id: 1, name: "Bob", age: 25 },
        { id: 2, name: "Alice", age: 24 }
    ]
}
```

## Joins

Left joins are supported via the `leftJoinWith` method:

```
leftJoinWith(rightTable, leftTableColumn, rightTableColumn)
```

If the two joined tables contain duplicate column names, those columns are prefixed 
by the table name followed by an underscore.

The following is an example join between a user's and order's table:

```
const ordersWithUser = orders.leftJoinWith(users, 'user_id', 'id');
```

## Other

Result sets support various other utility methods.

The `getColumns()` method returns the names of the columns in a result set.

```
resultSet.getColumns()
```

The method `withRenamedColumns(renamings)` creates a new result set with renamed columns. It 
accepts an object whose keys are old column names, and whose values are new column names:

```
resultSet.withRenamedColumns({
    'oldColumn1': 'newColumn1',
    'oldColumn2': 'newColumn2'
});
```


---

## Future Work
- Support mutation of database tables
- Add support for other types of joins (eg, inner and outer joins)


