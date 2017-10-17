/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/**
 * @module reps-events
 * @license MPL-2.0
 */
"use strict";

const DataStoreHolder = require("./data-store-holder");
const UpdateManager = require("./update-manager");
const ical = require("ical");
const util = require("util");

const promisedIcal = util.promisify(ical.fromURL);

/**
 * @param {[object]} [events=[]] - Already stored events.
 * @returns {[object]} Updated events.
 * @this module:reps-events.RepsEvents
 */
async function getEvents(events = []) {
    const cal = await promisedIcal(this.url, {});
    if(cal) {
        const newEvents = [];
        for(const e in cal) {
            const event = cal[e];
            if(!events.some((ev) => ev.url === event.url)) {
                this.emit('created', event);
            }
            newEvents.push(event);
        }
        return newEvents;
    }
    return [];
}

class RepsEvents extends DataStoreHolder {
    constructor(query) {
        super({
            events: getEvents
        });

        this.query = query;

        UpdateManager.register(this);
    }

    get url() {
        return `https://reps.mozilla.org/events/period/future/search/${encodeURIComponent(this.query)}/ical/`;
    }
}
module.exports = RepsEvents;