import React from 'react';
import { Link } from 'react-router-dom';

import { AppRoutes } from '../../constants/urls';
import Layout from '../../components/Layout';
import Button, { ButtonTypes, ButtonSizes, ButtonResponzivenesses } from '../../components/Button';

export default function MainMenu() {
    return (
        <Layout>
            <ul>
                <li>
                    <Button
                        size={ ButtonSizes.M }
                        type={ ButtonTypes.Secondary }
                        responsiveness={ ButtonResponzivenesses.FullWide }
                        onClick={ () => {} }
                    >Credits</Button>
                </li>
                <li>
                    <Button
                        size={ ButtonSizes.M }
                        type={ ButtonTypes.Secondary }
                        responsiveness={ ButtonResponzivenesses.FullWide }
                        onClick={ () => {} }
                    >New</Button>
                </li>
                <li>
                    <Button
                        size={ ButtonSizes.L }
                        type={ ButtonTypes.Primary }
                        responsiveness={ ButtonResponzivenesses.FullWide }
                        onClick={ () => {} }
                    >Play</Button>
                </li>
            </ul>
        </Layout>
    );
}