import React from 'react';

const StarfieldBackground = () => {
    return (
        <div className="starfield-wrapper">
            <div className="starfield-sparkle animate-twinkle">
                <div className="starfield-overlay" />
                <svg className="absolute inset-0 w-full h-full opacity-0 pointer-events-none">
                    <filter id="starfield-texture">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.75"
                            numOctaves="4"
                            result="noise"
                        />
                        <feColorMatrix
                            in="noise"
                            type="matrix"
                            values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 100 -95"
                            result="spots"
                        />
                        <feGaussianBlur in="spots" stdDeviation="0.5" result="blur" />
                        <feSpecularLighting
                            in="blur"
                            surfaceScale="2"
                            specularConstant="2"
                            specularExponent="40"
                            lightingColor="#BD9F67"
                            result="specular"
                        >
                            <fePointLight z="100" y="50" x="50" />
                        </feSpecularLighting>
                        <feComposite in="specular" in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
                    </filter>
                </svg>
            </div>
        </div>
    );
};

export default StarfieldBackground;
