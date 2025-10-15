import * as THREE from 'three'

export const holographicVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const holographicFragmentShader = `
  uniform float time;
  uniform vec3 color;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  
  void main() {
    // Fresnel effect for holographic look
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 2.0);
    
    // Animated scanlines
    float scanlines = sin(vPosition.y * 20.0 + time * 8.0) * 0.05 + 0.95;
    float horizontalLines = sin(vPosition.x * 15.0 + time * 3.0) * 0.03 + 0.97;
    
    // Color shifting based on position and time
    vec3 shiftedColor = color + vec3(
      sin(time * 2.0 + vPosition.x * 3.0) * 0.2,
      cos(time * 1.5 + vPosition.y * 2.0) * 0.2,
      sin(time * 3.0 + vPosition.z * 1.5) * 0.2
    );
    
    // Glitch effect
    float glitch = step(0.99, sin(time * 50.0)) * 0.1;
    shiftedColor += vec3(glitch, -glitch * 0.5, glitch * 0.3);
    
    // Combine all effects
    vec3 finalColor = shiftedColor * scanlines * horizontalLines * (fresnel + 0.1);
    
    // Holographic transparency
    float alpha = fresnel * 0.9 + 0.1;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export const createHolographicMaterial = (color: [number, number, number]) => {
  return {
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Vector3(...color) },
    },
    vertexShader: holographicVertexShader,
    fragmentShader: holographicFragmentShader,
    transparent: true,
  };
};
