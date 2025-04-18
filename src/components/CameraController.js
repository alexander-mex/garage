// CameraController.js

import { forwardRef, useImperativeHandle, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';

const CameraController = forwardRef(({ garageVisible }, ref) => {
  const { camera } = useThree();

  // 📌 Початкові координати камери в гаражі
  const initialCameraPosition = useMemo(() => ({ x: 400, y: 80, z: 80 }), []);
  const initialCameraLookAt = useMemo(() => ({ x: 0, y: 0, z: 0 }), []);

  // ✅ API для скидання камери
  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      gsap.to(camera.position, {
        ...initialCameraPosition,
        duration: 1.5,
        ease: 'power3.out',
        onUpdate: () => camera.lookAt(initialCameraLookAt.x, initialCameraLookAt.y, initialCameraLookAt.z),
      });
    },
  }));

  // 📌 Автоматичне повернення камери при вході в гараж
  useEffect(() => {
    if (garageVisible) {
      gsap.to(camera.position, {
        ...initialCameraPosition,
        duration: 1.5,
        ease: 'power3.out',
        onUpdate: () => camera.lookAt(initialCameraLookAt.x, initialCameraLookAt.y, initialCameraLookAt.z),
      });
    }
  }, [garageVisible, camera, initialCameraLookAt, initialCameraPosition]);

  return null;
});

export default CameraController;