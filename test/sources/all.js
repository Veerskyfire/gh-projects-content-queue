import test from 'ava';
import Discourse from '../../lib/sources/discourse';
import Events from '../../lib/sources/events';
import Issues from '../../lib/sources/issues';
import Mentions from '../../lib/sources/mentions';
import Reminder from '../../lib/sources/reminder';
import Squad from '../../lib/sources/squad';
import Tweeting from '../../lib/sources/tweeting';

const sources = [
    Discourse,
    Events,
    Issues,
    Mentions,
    Reminder,
    Squad,
    Tweeting
];

const testRequiredConfig = (t, source) => {
    t.true(Array.isArray(source.requiredConfig));
    t.is(source.requiredConfig.includes('columns'), source.requiredColumns.length > 0);
};

const testRequiredColumns = (t, source) => {
    t.true(Array.isArray(source.requiredColumns));
    t.is(source.requiredColumns.length > 0, source.requiredConfig.includes('columns'));
};

const testManagedColumns = (t, source) => {
    t.true(Array.isArray(source.managedColumns));
};

for(const source of sources) {
    test('required config', testRequiredConfig, source);
    test('required columns', testRequiredColumns, source);
    test('managed columns', testManagedColumns, source);
}
