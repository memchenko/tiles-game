declare module "page-lifecycle" {
    import { IStateChangeEvent } from './types';

    export default {
        addEventListener(
            eventName: 'statechange',
            callback: (event: IStateChangeEvent) => void,
        ) {},

        removeEventListener(
            eventName: 'statechange',
            callback: (event: IStateChangeEvent) => void,
        ): {}
    };
}