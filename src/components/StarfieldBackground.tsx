import React from 'react';

const StarfieldBackground = () => {
    return (
        <div className="starfield-wrapper">
            <div className="starfield-sparkle animate-twinkle">
                <div className="starfield-overlay" />
                <svg className="hidden">
                    <filter id="starfield-texture">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.15"
                            numOctaves={5}
                            result="noise"
                        />
                        <feGaussianBlur in="noise" stdDeviation="0.4" result="blur" />
                        <feSpecularLighting
                            in="blur"
                            surfaceScale={3}
                            specularConstant="1.2"
                            specularExponent={40}
                            lightingColor="#D4AF37"
                            result="specular"
                        >
                            <fePointLight z={120} y={100} x={100} />
                        </feSpecularLighting>
                        <feComposite in="specular" in2="SourceGraphic" operator="over" result="lit" />
                        <feBlend in="SourceGraphic" in2="lit" mode="color-dodge" />
                    </filter>
                </svg>
            </div>
        </div>
    );
};

export default StarfieldBackground;
