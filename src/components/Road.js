import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, Environment } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import CarControls from './CarController';
import Car1 from './Car1';
import Car2 from './Car2';
import Car3 from './Car3';
import Trees from './Trees';
import Clouds from './Clouds';
import Field from './Field';

function Road({ selectedCar }) {
  const { scene: roadScene1 } = useGLTF('/models/road1.glb');
  const { camera } = useThree();
  const carRef = useRef();
  const [roadSegments, setRoadSegments] = useState([-1800, 0, 1800, 3600, 5200, 7000]);
  const lastZ = useRef(0);
  const movingDirection = useRef(1);

  useEffect(() => {
    camera.far = 100000;
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame(() => {
    if (!carRef.current) return;

    const currentZ = carRef.current.position.z;
    movingDirection.current = currentZ > lastZ.current ? 1 : -1;
    lastZ.current = currentZ;

    if (
      (movingDirection.current === 1 && roadSegments[0] < currentZ - 5000) ||
      (movingDirection.current === -1 && roadSegments[roadSegments.length - 1] > currentZ + 5000)
    ) {
      setRoadSegments((prev) => {
        return movingDirection.current === 1
          ? [...prev.slice(1), prev[prev.length - 1] + 1800]
          : [prev[0] - 1800, ...prev.slice(0, prev.length - 1)];
      });
    }
  });

  return (
    <group>
      <ambientLight intensity={0} />
      <directionalLight position={[100, 100, 1]} intensity={-1.8} castShadow />
      <Environment files="/hdr/sky.hdr" background />
      {roadSegments.map((zPos) => (
        <primitive key={`road-${zPos}`} object={roadScene1.clone()} position={[0, 0, zPos]} scale={[150, 20, 400]} />
      ))}

      <Field roadSegments={roadSegments} />
      <Trees roadSegments={roadSegments} />
      <Clouds carRef={carRef} />

      {selectedCar === 0 && <Car1 ref={carRef} position={[0, 5, 0]} scale={[0.4, 0.4, 0.4]} rotation={[0, Math.PI/2, 0]}/>}
      {selectedCar === 1 && <Car2 ref={carRef} position={[0, 5, 0]} scale={[40, 40, 40]} rotation={[0, 0, 0]} />}
      {selectedCar === 2 && <Car3 ref={carRef} position={[0, 5, 0]} scale={[160, 160, 160]} rotation={[0, Math.PI, 0]} />}

      <CarControls carRef={carRef} camera={camera} />
    </group>
  );
}

export default Road;