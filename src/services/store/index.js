import { Subject } from 'rxjs';
import { scan, filter } from 'rxjs/operators';

import { set, over } from 'ramda';

const isFunction = val => typeof val === 'function';

export default class Store {
    $store = null;

    constructor(initialState) {
        this.$store = (new Subject())
            .pipe(
                filter(isFunction),
                scan((acc, setter) => setter(acc), initialState)
            );
    }

    set(lensPath, value) {
        this.$store.next((state) => {
            return set(lensPath, value, state);
        });
    }

    process(lensPath, setter) {
        this.$store.next((state) => {
            return over(lensPath, setter, state);
        });
    }
}
