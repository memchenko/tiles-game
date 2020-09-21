import { BehaviorSubject } from 'rxjs';

export default class Stateful<States> {
    private states: (States | null)[];
    private current: [States | null, unknown] | [null] = [null];
    private stateHandlers: Map<States | null, Function[]> = new Map();

    currentState$ = new BehaviorSubject<[States | null, unknown] | [null]>([null]);

    constructor(states: States[]) {
        this.states = states;
        this.states.push(null);
    }

    setState(state: States | null, context?: unknown) {
        if (!this.states.includes(state)) {
            return;
        }

        this.current = [state, context];

        this.currentState$.next([state, context]);
        this.invokeHandlers(state, context);
    }

    getCurrentState() {
        return this.current;
    }

    on(state: States, handler: Function) {
        const handlers = this.stateHandlers.has(state)
            ? this.stateHandlers.get(state)!.concat(handler)
            : [handler];

        this.stateHandlers.set(state, handlers);
    }

    private invokeHandlers(state: States | null, context: unknown) {
        if (!this.stateHandlers.has(state)) {
            return;
        }

        this.stateHandlers.get(state)!.forEach(fn => fn(context));
    }
}