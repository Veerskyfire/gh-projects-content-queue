import test from 'ava';
import * as pagination from '../lib/pagination';
import { getGithubClient } from './_stubs';
import sinon from 'sinon';

test('github pagination', async (t) => {
    const client = getGithubClient();
    const firstPage = {
        data: [
            'foo'
        ]
    };
    const secondPage = {
        data: [
            'bar'
        ]
    };
    client.hasNextPage.returns(false);
    client.hasNextPage.withArgs(sinon.match(firstPage)).returns(true);
    client.getNextPage.resolves(secondPage);

    const data = await pagination.github(client, firstPage);
    t.deepEqual(data, [
        'foo',
        'bar'
    ]);
    t.true(client.hasNextPage.calledWith(firstPage));
    t.true(client.hasNextPage.calledWith(secondPage));
});

test('twitter pagination', async (t) => {
    const method = sinon.stub();
    const params = {
        count: 2
    };
    const firstPage = [
        {
            id_str: '1237'
        },
        {
            id_str: '1234'
        }
    ];

    method.resolves([]);
    method.withArgs({
        count: 2
    }).resolves(firstPage);

    const result = await pagination.twitter(method, params);

    t.deepEqual(result, firstPage);
    t.true(method.calledWith(sinon.match({
        max_id: '1233'
    })));
});

test('subtract id with carry in twitter pagination', async (t) => {
    const method = sinon.stub();
    const params = {
        count: 2
    };
    const firstPage = [
        {
            id_str: '1237'
        },
        {
            id_str: '1230'
        }
    ];

    method.resolves([]);
    method.withArgs({
        count: 2
    }).resolves(firstPage);

    const result = await pagination.twitter(method, params);

    t.deepEqual(result, firstPage);
    t.true(method.calledWith(sinon.match({
        max_id: '1229'
    })));
});

test('twitter pagination defaults to 200 items', async (t) => {
    const method = sinon.stub();
    method.resolves([]);

    const result = await pagination.twitter(method, {});

    t.is(result.length, 0);

    t.true(method.calledWith(sinon.match({
        count: 200
    })));
});
