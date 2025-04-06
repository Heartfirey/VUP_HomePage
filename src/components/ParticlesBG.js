import React from "react";

export default function ParticlesBG() {
    return (
        <div style={{ width: '100%', height: '600px', position: 'absolute' }}>
            <Particles
                particleColors={['#ffffff', '#ffffff']}
                particleCount={200}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover={true}
                alphaParticles={false}
                disableRotation={false}
            />
        </div>
    )
}
