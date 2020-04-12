import { usersTable } from './TestUtils';

describe('_createLabelsListing', () => {
    it('handles zero column SELECT', () => {
        const query = '';
        const expected = '';
        expect(usersTable._createLabelsListing(query)).toEqual(expected);
    });

    it('handles single column SELECT', () => {
        const query = 'select |id|';
        const expected = "|id| 'id'";
        expect(usersTable._createLabelsListing(query)).toEqual(expected);
    });

    it('handles multi column SELECT', () => {
        const query = 'select |id|, |name|';
        const expected = "|id| 'id', |name| 'name'";
        expect(usersTable._createLabelsListing(query)).toEqual(expected);
    });

    it('handles functions in SELECT', () => {
        const query = 'select max(|id|)';
        const expected = "max(|id|) 'max(id)'";
        expect(usersTable._createLabelsListing(query)).toEqual(expected);
    });
});