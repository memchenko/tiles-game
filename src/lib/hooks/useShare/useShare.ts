import { useCallback } from 'react';

import { IUseShareData } from './types';

export function useShare(): [boolean, (data: IUseShareData) => Promise<void>] {
    const isNative = Boolean(navigator.share);

    const handler = useCallback((data: IUseShareData) => {
        return navigator.share(data as ShareData);
    }, []);

    return [isNative, handler];
}