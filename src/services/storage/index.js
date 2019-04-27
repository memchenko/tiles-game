import localforage from 'localforage';
import { Subject } from 'rxjs';

import * as TABLES from '_constants/tables';
import { UNKNOWN_TABLE } from '_constants/errors';

const STORAGES = Object.values(TABLES).reduce((acc, tableName) => {
    return {
        ...acc,
        [tableName]: localforage.createInstance({ name: tableName })
    };
}, {});

export function persistDataTo(table) {
    if (!isTableExist(table)) {
        throw new Error(UNKNOWN_TABLE);
    }

    return async (key, value) => {
        await STORAGES[table].setItem(key, value);
        $storageUpdates.next({ table, key, value });
    };
}

export function getDataFrom(table) {
    if (!isTableExist(table)) {
        throw new Error(UNKNOWN_TABLE);
    }

    return key => STORAGES[table].getItem(key);
}

function isTableExist(table) {
    return table in TABLES;
}

export const $storageUpdates = new Subject();
