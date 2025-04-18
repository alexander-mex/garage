import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import Car1, { car1Camera } from './Car1';
import Car2, { car2Camera } from './Car2';
import Car3, { car3Camera } from './Car3';
import Garage from './Garage';
import Arrow from './Arrow';
import Road from './Road';
import CameraController from './CameraController';
import Preloader from './Preloader';
import '../App.css';
import '../styles/CarModel.css';

function CarModel() {
  const [carIndex, setCarIndex] = useState(0);
  const [selectedCar, setSelectedCar] = useState(null);
  const [garageVisible, setGarageVisible] = useState(true);
  const carRefs = useRef([]);
  const garageRef = useRef(null);
  const cameraRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const cars = [
    {
      component: Car1,
      camera: car1Camera,
      position: [0, -65, -40],
      scale: [0.78, 0.78, 0.78],
      rotation: [0, 300, 0],
    },
    {
      component: Car2,
      camera: car2Camera,
      position: [0, -60, 20],
      scale: [70, 70, 70],
      rotation: [0, Math.PI, 0],
    },
    {
      component: Car3,
      camera: car3Camera,
      position: [0, -65, 15],
      scale: [320, 320, 320],
      rotation: [0, 0, 0],
    },
  ];

  const handleCarSelect = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setSelectedCar(carIndex);
      setGarageVisible(false);
    }, 2000);

    if (garageRef.current) {
      gsap.to(garageRef.current.position, {
        y: -200,
        duration: 1,
        ease: 'power3.out',
      });
    }
  };

  const handleReturnToGarage = () => {
    setSelectedCar(null);

    if (selectedCar !== null) {
      setGarageVisible(true);
      setCarIndex(selectedCar);
      setSelectedCar(null);
    }
  };

  const handleNext = () => {
    setCarIndex((prev) => (prev < cars.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCarIndex((prev) => (prev > 0 ? prev - 1 : cars.length - 1));
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas camera={{ near: 0.1, far: 5000, fov: 50 }}>
        {isLoading && <Preloader />}

        <CameraController ref={cameraRef} garageVisible={garageVisible} />

        <ambientLight intensity={0} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />

        {garageVisible && <Garage ref={garageRef} onSelectCar={handleCarSelect} />}

        {garageVisible &&
          cars.map((car, index) => {
            const CarComponent = car.component;
            return (
              <group
                key={index}
                ref={(el) => (carRefs.current[index] = el)}
                visible={index === carIndex}
              >
                <CarComponent
                  position={car.position}
                  scale={car.scale}
                  rotation={car.rotation}
                />
              </group>
            );
          })}

        {!garageVisible && (
          <Road scale={[3, 3, 3]} selectedCar={selectedCar} onReturnToGarage={handleReturnToGarage} />
        )}

        {garageVisible && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            target={[0, 0, 0]}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            enableDamping={true}
            dampingFactor={0.1}
            minDistance={250}
            maxDistance={800}
          />
        )}

        {garageVisible && (
          <>
            <Arrow 
              modelPath="/models/arrowL.glb" 
              position={[0, 0, 230]} 
              rotation={[-Math.PI / 2, Math.PI, -Math.PI / 2]} 
              onClick={handleNext}
            />
            <Arrow 
              modelPath="/models/arrowR.glb" 
              position={[0, 0, -210]} 
              rotation={[-Math.PI / 2, 0, Math.PI / 2]} 
              onClick={handlePrev}
            />
          </>
        )}
      </Canvas>

      {!garageVisible && (
        <button
          className="btn-return"
          style={{
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
          }}
          onClick={handleReturnToGarage}
        >
          Return
        </button>
      )}
    </div>
  );
}

export default CarModel;
