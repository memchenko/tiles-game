import { Subject } from 'rxjs';
import { scan, filter, tap } from 'rxjs/operators';
import { set, lensPath, partialRight } from 'ramda';
import { createComposableService } from '_utils/pipes/services';

const isFunction = val => typeof val === 'function';

export default class Store {
    _state = null;
    $store = null;

    constructor(initialState) {
        this._state = initialState;

        this.$store = (new Subject())
            .pipe(
                filter(isFunction),
                scan((acc, setter) => setter(acc), initialState),
                tap(state => this._state = state)
            );
    }

    set(lensPath, value) {
        this.$store.next((state) => {
            return set(lensPath, value, state);
        });
    }
}

export const createComposableStore = partialRight(
    createComposableService,
    [
        (service, observer) => (newState) => {
            service.$store.pipe(tap(observer.next));
            service.set(lensPath([]), newState);
        }
    ]
);
