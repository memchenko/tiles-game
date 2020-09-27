import React, { useCallback } from 'react';
import { useHistory } from 'react-router';

import './Credits.scss';

import Layout from '../../components/Layout';
import { IconTypes } from '../../components/Icon';

export default function Credits() {
    const history = useHistory();
    const goBack = useCallback(() => {
        history.goBack();
    }, [history]);

    return (
        <Layout
            headerProps={{
                leftIconType: IconTypes.Back,
                onLeftIconClick: goBack,
            }}
        >
            <div className="y-center row-1 credits">
                <h2 className="credits__title">SOUNDS</h2>
                <hr className="credits__divider" />
                <p className="credits__text">
                    All sounds taken from website <a className="credits__link" href="https://freesound.org/">freesound.org</a>
                </p>
                <ul className="credits__list">
                    <li className="credits__text">
                        Click sound: <a className="credits__link" href="https://freesound.org/people/florian_reinke/sounds/63533/">click here</a>
                    </li>
                    <li className="credits__text">
                        Success sound: <a className="credits__link" href="https://freesound.org/people/plasterbrain/sounds/397354/">click here</a>
                    </li>
                </ul>
            </div>
        </Layout>
    );
}
