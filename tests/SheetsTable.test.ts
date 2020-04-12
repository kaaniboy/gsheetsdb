import { usersTable } from './TestUtils';

describe('_createLabels', () => {
    it('handles zero column SELECT', () => {
        const query = '';
        const expected: string[] = [];
        expect(usersTable._createLabels(query)).toEqual(expected);
    });

    it('handles single column SELECT', () => {
        const query = 'SELECT |id|';
        const expected = ["|id| 'id'"];
        expect(usersTable._createLabels(query)).toEqual(expected);
    });

    it('handles multi column SELECT', () => {
        const query = 'SELECT |id|, |name|';
        const expected = ["|id| 'id'", "|name| 'name'"];
        expect(usersTable._createLabels(query)).toEqual(expected);
    });
});

describe('_createLabelsListing', () => {
    it('handles zero column SELECT', () => {
        const query = '';
        const expected = '';
        expect(usersTable._createLabelsListing(query)).toEqual(expected);
    });

    it('handles single column SELECT', () => {
        const query = 'SELECT |id|';
        const expected = "|id| 'id'";
        expect(usersTable._createLabelsListing(query)).toEqual(expected);
    });

    it('handles multi column SELECT', () => {
        const query = 'SELECT |id|, |name|';
        const expected = "|id| 'id', |name| 'name'";
        expect(usersTable._createLabelsListing(query)).toEqual(expected);
    });
});