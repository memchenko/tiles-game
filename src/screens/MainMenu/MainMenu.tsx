import React from 'react';
import { Link } from 'react-router-dom';

import { AppRoutes } from '../../constants/urls';
import Layout from '../../components/Layout';

export default function MainMenu() {
    return (
        <Layout>
            <ul>
                <li>
                    <Link to={ AppRoutes.Scenario }>Сценарии</Link>
                </li>
                <li>
                    <Link to={ AppRoutes.Play }>Играть</Link>
                </li>
            </ul>
        </Layout>
    );
}