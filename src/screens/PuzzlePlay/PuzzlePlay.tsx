import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PuzzlePlay() {
    const { state } = useLocation<{ isNew: boolean; }>();
    
    useEffect(() => {
        if (state && state.isNew) {

        }
    }, [state]);

    return null;
}
