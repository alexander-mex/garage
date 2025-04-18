// Garage.js

import React, { useRef } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import '../styles/Garage.css';

function Garage({ onSelectCar }) {
  const garageRef = useRef();
  const platformRef = useRef();
  
  const { scene: garageScene } = useGLTF('/models/garage.glb');
  const { scene: platformScene } = useGLTF('/models/platform.glb'); 

  return (
    <group>
      {/* Гараж */}
      <primitive ref={garageRef} object={garageScene} position={[0, -160, 0]} scale={[50, 50, 50]} />
      
      {/* Платформа */}
      <primitive ref={platformRef} object={platformScene} position={[0, -70, 0]} scale={[70, 70, 70]} />

      {/* 3D кнопка "Обрати авто" */}
      <Html transform={false}>
        <button className='btn-choose'
          onClick={onSelectCar}
        >
          Choose the car
        </button>
      </Html>
    </group>
  );
}

export default Garage;