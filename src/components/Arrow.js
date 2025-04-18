import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';

function Arrow({ modelPath, position, rotation, onClick }) {
  const arrowRef = useRef();
  const { scene } = useGLTF(modelPath);
  const [isAnimating, setIsAnimating] = useState(false);

  // Анімація пульсації стрілки
  useEffect(() => {
    const pulseAnimation = gsap.to(arrowRef.current.position, {
      y: position[1] + 5,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
    });

    return () => {
      pulseAnimation.kill();
    };
  }, [position]);

  // Обробник наведення курсора
  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer';
    gsap.to(arrowRef.current.scale, {
      x: 12,
      y: 12,
      z: 12,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  // Обробник виходу курсора
  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    gsap.to(arrowRef.current.scale, {
      x: 10,
      y: 10,
      z: 10,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  // Обробник кліку
  const handleClick = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      gsap.to(arrowRef.current.scale, {
        x: 15,
        y: 15,
        z: 15,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => setIsAnimating(false),
      });
    }
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <primitive
      ref={arrowRef}
      object={scene}
      position={position}
      rotation={rotation}
      scale={[10, 10, 10]} // Збільшений масштаб
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      visible={true} // Примусова видимість
    />
  );
}

export default Arrow;