import React, { useRef, useEffect } from 'react';

import { ReactComponent as ShareSvg } from '../../assets/images/share.svg';
import { IShareIconProps, ShareIconColors } from './types';

// { color || ShareIconColors.Inactive }
export function ShareIcon({ color }: IShareIconProps) {
    const element = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!element.current) {
            return;
        }

        (element.current.children[0] as unknown as { fill: string; }).fill = color || ShareIconColors.Inactive;
    }, [color, element.current]);

    return (
        <ShareSvg ref={element} />
    );
}
