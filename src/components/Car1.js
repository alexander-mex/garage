import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';

const Car1 = forwardRef(({ props, position, scale, rotation }, ref) => {
  const { scene } = useGLTF('/models/Car1.glb');

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

export const car1Camera = { position: [450, 80, 100], fov: 50, near: 0.1, far: 5000 };

export default Car1;