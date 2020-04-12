import { db } from './TestUtils';
import SheetsResultSet from '../src/SheetsResultSet';

describe('run', () => {
    it('returns a single row for queries with aggregate functions', async () => {
        const query = 'SELECT MIN(|id|), MAX(|id|)';
        const resultSet = <SheetsResultSet> await db.table('users').query(query);
        expect(resultSet.rows).toHaveLength(1);
    });
});