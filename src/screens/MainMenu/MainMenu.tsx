import React from 'react';
import { Link } from 'react-router-dom';

import { AppRoutes } from '../../constants/urls';

export default function MainMenu() {
    return (
        <ul>
            <li>
                <Link to={ AppRoutes.Scenario }>Сценарии</Link>
            </li>
            <li>
                <Link to={ AppRoutes.Play }>Играть</Link>
            </li>
        </ul>
    );
}