import React, { useEffect } from 'react';
import { Snow } from 'jparticles';
import sakura from '../assets/sakura.js';

const SakuraBG = () => {
    useEffect(() => {
        const config = {
            num: window.innerWidth < 768 ? 20 : 30,
            maxR: 12,
            minR: 4,
            maxSpeed: 0.4,
            minSpeed: 0.1,
            swing: true,
            swingProbability: 0.9,
            spin: true,
            shape: sakura(),
        };
        if (typeof Snow === 'function') {
            new Snow('#snow', config);
        }
    }, []);

    return (
        <div
            id="snow"
            className="absolute inset-0 w-full h-full"
            style={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9,
                pointerEvents: 'none',
            }}
        ></div>
    );
};

export default SakuraBG;
