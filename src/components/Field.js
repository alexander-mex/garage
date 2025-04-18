import React, { useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping } from "three";

function Field({ roadSegments }) {
  const grassTexture = useLoader(TextureLoader, "/textures/grass.jpg");

  useEffect(() => {
    grassTexture.wrapS = RepeatWrapping;
    grassTexture.wrapT = RepeatWrapping;
    grassTexture.repeat.set(100, 100);
    grassTexture.anisotropy = 16;
  }, [grassTexture]);

  const [fieldSegments, setFieldSegments] = useState([]);

  useEffect(() => {
    setFieldSegments([...roadSegments]); // Копіюємо масив доріг у поле
  }, [roadSegments]);

  return (
    <>
      {fieldSegments.map((zPos) => (
        <mesh key={`field-${zPos}`} position={[0, -5.1, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12000, 2000, 10, 10]} />
          <meshStandardMaterial map={grassTexture} />
        </mesh>
      ))}
    </>
  );
}

export default Field;
