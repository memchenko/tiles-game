import localforage from 'localforage';
import { Subject } from 'rxjs';

import * as TABLES from '_constants/tables';
import { UNKNOWN_TABLE } from '_constants/errors';

const STORAGES = Object.values(TABLES).reduce((acc, tableName) => {
    acc.set(tableName, localforage.createInstance({ name: tableName }));

    return acc;
}, new Map());

export default class Storage {
    $storageUpdates = null;

    constructor() {
        this.$storageUpdates = new Subject();
    }

    async set(table, key, value) {
        this._throwIfTableIsntExist(table);
        
        await STORAGES.get(table).setItem(key, value);
        this.$storageUpdates.next({ table, key, value });
    }

    async read(table, key) {
        this._throwIfTableIsntExist(table);

        return STORAGES.get(table).getItem(key);
    }

    async readAll() {
        const result = new Map();

        const resultPushers = [];

        STORAGES.forEach((storage, table) => {
            resultPushers.push(async () => {
                const instances = [];
                const result = await storage.iterate((value, key) => {
                    instances.push({ key, value });
                });
                result.set(table, instances);
            });
        });

        await Promise.all(resultPushers);
        
        return result;
    }

    _throwIfTableIsntExist(tableName) {
        if (!isTableExist(tableName)) {
            throw new Error(UNKNOWN_TABLE);
        }
    }
}

function isTableExist(table) {
    return STORAGES.has(table);
}
