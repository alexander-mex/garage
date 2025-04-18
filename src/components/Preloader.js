import React from 'react';
import { Html } from '@react-three/drei';
import '../styles/Preloader.css';

function Preloader() {
  return (
    <Html center>
      <div className="loader"></div>
    </Html>
  );
}

export default Preloader;
