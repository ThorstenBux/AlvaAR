import {
  DeviceOrientationControls,
  Environment,
  Plane,
} from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useAlvaAR } from './useAlvaAR';

const AlvaARComponent = ({
  canvasRef,
  containerRef,
  video,
  videoReady,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  video: HTMLVideoElement | null;
  videoReady: boolean;
}) => {
  useAlvaAR({
    video: video,
    container: containerRef.current,
    videoReady,
  });

  return (
    <>
      <DeviceOrientationControls />

      {/* Shadow plane */}
      <Plane
        receiveShadow
        args={[30, 30]}
        name={'ground'}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
      >
        <shadowMaterial attach='material' opacity={0.5} color={'#000000'} />
      </Plane>
      {/* The real content */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color={'#ff0000'}></meshStandardMaterial>
      </mesh>
      {/* Setup lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight color='red' position={[0, 0, 5]} />
      <Environment preset='city' background={false} />
      {/* <gridHelper args={[30, 30, '#000000', '#f1f1f1']} /> */}
      {/* </Debug> */}
    </>
  );
};

export default AlvaARComponent;
