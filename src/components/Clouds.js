import React, { useState, useEffect, useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

function Clouds({ carRef }) {
  const { scene: cloudScene } = useGLTF("/models/cloud.glb");
  const { scene: cloudScene1 } = useGLTF("/models/cloud1.glb");

  const cloudModels = useMemo(() => [
    { model: cloudScene, scale: [150, 100, 60] },
    { model: cloudScene1, scale: [200, 150, 70] },
  ], [cloudScene, cloudScene1]);

  const cloudCount = 24; 
  const cloudBaseHeight = 600;
  const cloudDistanceZ = 15000;
  const cloudSpeedX = 0.3;
  
  const [direction] = useState(() => Math.random() > 0.5 ? 1 : -1);
  const [clouds, setClouds] = useState([]);
  const groupRef = useRef();

  useEffect(() => {
    const initialClouds = [];
    
    for (let i = 0; i < cloudCount/2; i++) {
      const x = Math.random() * 12000 - 6000;
      const z = Math.random() * 5000 + cloudDistanceZ;
      const modelData = cloudModels[i % cloudModels.length];

      initialClouds.push({
        id: Math.random(),
        model: modelData.model,
        position: [x, cloudBaseHeight + Math.random() * 50, z],
        scale: modelData.scale,
        speedX: (Math.random() * 0.2 + cloudSpeedX) * direction,
      });
    }

    for (let i = cloudCount/2; i < cloudCount; i++) {
      const x = Math.random() * 12000 - 6000;
      const z = Math.random() * 5000 - cloudDistanceZ;
      const modelData = cloudModels[i % cloudModels.length];

      initialClouds.push({
        id: Math.random(),
        model: modelData.model,
        position: [x, cloudBaseHeight + Math.random() * 50, z],
        scale: modelData.scale,
        speedX: (Math.random() * 0.2 + cloudSpeedX) * direction,
      });
    }

    setClouds(initialClouds);
  }, [cloudModels, direction, cloudCount, cloudDistanceZ, cloudSpeedX]);

  useFrame(() => {
    if (!groupRef.current || !carRef.current) return;
    
    const carPosition = carRef.current.position;
    
    groupRef.current.position.set(
      carPosition.x,
      0,
      carPosition.z
    );

    setClouds((prevClouds) =>
      prevClouds.map((cloud) => {
        let newX = cloud.position[0] + cloud.speedX;
        
        if (direction > 0 && newX > 6000) newX = -6000;
        if (direction < 0 && newX < -6000) newX = 6000;

        return {
          ...cloud,
          position: [newX, cloud.position[1], cloud.position[2]],
        };
      })
    );
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud) => (
        <primitive
          key={`cloud-${cloud.id}`}
          object={cloud.model.clone()}
          position={cloud.position}
          scale={cloud.scale}
        />
      ))}
    </group>
  );
}

export default Clouds;