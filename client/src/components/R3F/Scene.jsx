
import { Canvas } from '@react-three/fiber';
import {  useGLTF } from "@react-three/drei"
function Scene() {


  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
        <primitive/>
    </Canvas>
  );
}

export default Scene;
