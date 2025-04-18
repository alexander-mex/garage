import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function CarControls({ carRef, camera, onVelocityChange }) {
  const [acceleration, setAcceleration] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isBraking, setIsBraking] = useState(false);
  const maxSpeed = 10;
  const maxReverseSpeed = 5;
  const accelerationRate = 0.2;
  const brakingRate = 0.3;
  const handBrakeRate = 0.5;
  const turnSpeed = 0.03;
  const friction = 0.05;
  const turnInertia = 0.1;
  
  const roadWidth = 200;
  const velocity = useRef(0);
  const currentTurn = useRef(0);
  const initialRotation = useRef(0);

  useEffect(() => {
    if (carRef.current) {
      initialRotation.current = carRef.current.rotation.y;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') setAcceleration(accelerationRate);
      if (event.key === 'ArrowDown') setAcceleration(-brakingRate);
      if (event.key === 'ArrowLeft') setDirection(turnSpeed);
      if (event.key === 'ArrowRight') setDirection(-turnSpeed);
      if (event.key === ' ') setIsBraking(true);
    };

    const handleKeyUp = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') setAcceleration(0);
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') setDirection(0);
      if (event.key === ' ') setIsBraking(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [carRef]);

  useFrame(() => {
    if (!carRef.current) return;
    velocity.current += acceleration;
    
    if (onVelocityChange) onVelocityChange(velocity.current);

    if (isBraking) {
      if (velocity.current > 0) {
        velocity.current = Math.max(0, velocity.current - handBrakeRate);
      } else if (velocity.current < 0) {
        velocity.current = Math.min(0, velocity.current + handBrakeRate);
      }
    }
    
    velocity.current = Math.max(-maxReverseSpeed, Math.min(maxSpeed, velocity.current));

    if (acceleration === 0 && !isBraking) {
      if (velocity.current > 0) velocity.current = Math.max(0, velocity.current - friction);
      if (velocity.current < 0) velocity.current = Math.min(0, velocity.current + friction);
    }

    let newX = carRef.current.position.x + Math.sin(carRef.current.rotation.y) * velocity.current;
    let newZ = carRef.current.position.z + Math.cos(carRef.current.rotation.y) * velocity.current;

    if (newX > -roadWidth / 2 && newX < roadWidth / 2) {
      carRef.current.position.x = newX;
    }

    carRef.current.position.z = newZ;

    currentTurn.current += (direction - currentTurn.current) * turnInertia;
    if (velocity.current !== 0) {
      let newRotation = carRef.current.rotation.y + currentTurn.current * (velocity.current / maxSpeed);

      carRef.current.rotation.y = newRotation;
    }

    const offset = { x: 0, y: 120, z: 350 };
    const carPos = carRef.current.position;
    
    const camX = carPos.x + Math.sin(carRef.current.rotation.y) * offset.z;
    const camZ = carPos.z + Math.cos(carRef.current.rotation.y) * offset.z;

    camera.position.set(camX, carPos.y + offset.y, camZ);
    camera.lookAt(carPos);
  });

  return null;
}

export default CarControls;