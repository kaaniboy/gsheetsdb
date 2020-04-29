import { usersTable } from './TestUtils';

describe('_createLabelsListing', () => {
    it('handles zero column SELECT', () => {
        const query = '';
        const expected = '';
        expect(usersTable._prepareQuery(query)).toEqual(expected);
    });

    it('handles single column SELECT', () => {
        const query = 'select |id|';
        const expected = "select A label A 'id'";
        expect(usersTable._prepareQuery(query)).toEqual(expected);
    });

    it('handles multi column SELECT', () => {
        const query = 'select |id|, |name|';
        const expected = "select A, B label A 'id', B 'name'";
        expect(usersTable._prepareQuery(query)).toEqual(expected);
    });

    it('handles functions in SELECT', () => {
        const query = 'select max(|id|)';
        const expected = "select max(A) label max(A) 'max(id)'";
        expect(usersTable._prepareQuery(query)).toEqual(expected);
    });
});