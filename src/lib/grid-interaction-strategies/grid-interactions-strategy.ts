import { TouchStrategy } from './TouchStrategy';
import { MouseStrategy } from './MouseStrategy';

import { isTouchDevice } from '../../utils/client';

export function getGridInteractionStrategy(element: HTMLElement) {
    if (isTouchDevice()) {
        return new TouchStrategy(element);
    } else {
        return new MouseStrategy(element);
    }
}