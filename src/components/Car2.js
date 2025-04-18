import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';

const Car2 = forwardRef(({ props, position, scale, rotation }, ref) => {
  const { scene } = useGLTF('/models/Car2.glb');

  return (
    <group ref={ref} {...props}>
      <primitive 
        ref={ref} 
        object={scene} 
        position={position}
        scale={scale}
        rotation={rotation}
      />
    </group>
  );
});

export const car2Camera = { position: [0, 50, 0], fov: 50, near: 0.1, far: 5000 };

export default Car2;