import { BehaviorSubject } from 'rxjs';
import { scan, tap } from 'rxjs/operators';
import { set, lensPath, partialRight, clone } from 'ramda';
import { createComposableService } from '_utils/pipes/services';

const isFunction = val => typeof val === 'function';

export default class Store {
    _state = null;
    $changed = null;

    constructor(initialState) {
        this._state = initialState;

        this.$changed = (new BehaviorSubject())
            .pipe(
                scan((acc, setter) => (
                    isFunction(setter) ? setter(acc) : acc
                ), initialState),
                tap(state => this._state = state)
            );

        this.set = this.set.bind(this);
        this.getState = this.getState.bind(this);
    }

    set(lensPath, value) {
        this.$changed.next((state) => {
            return set(lensPath, value, state);
        });
    }

    getState() {
        return clone(this._state);
    }
}

export const createComposableStore = partialRight(
    createComposableService,
    [
        (service, observer) => (newState) => {
            service.$changed.pipe(tap(observer.next));
            service.set(lensPath([]), newState);
        }
    ]
);
