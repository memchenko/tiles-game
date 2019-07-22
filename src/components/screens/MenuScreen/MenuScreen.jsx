import React from 'react';
import { Link } from 'react-router-dom';

import { PLAY, SCENARIO } from '_constants/routes';

export default function MenuScreen() {
    return (
        <ul>
            <li><Link to={ SCENARIO }>Сценарии</Link></li>
            <li><Link to={ PLAY }>Играть</Link></li>
        </ul>
    );
}
