import * as assert from 'assert';
import { getCoordinatesToHighlight } from '../color_line_rules';

suite('Test color letter rules', () => {
	test('Basic test', () => {
                const text = "Some text";
                const cursorNumber = 2;
                const expected  = [ [7], [0] ];
                const result =  getCoordinatesToHighlight(text, cursorNumber);
                assert.equal(result, expected);
	});
});
