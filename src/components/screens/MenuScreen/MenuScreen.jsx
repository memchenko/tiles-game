import React from 'react';
import { Link } from 'react-router-dom';

export default function MenuScreen() {
    return (
        <ul>
            <li><Link to="/play">Играть</Link></li>
        </ul>
    );
}
