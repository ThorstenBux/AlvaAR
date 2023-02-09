import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { ACESFilmicToneMapping, sRGBEncoding, PCFSoftShadowMap } from 'three';
import AlvaARComponent from './AlvaARComponent';

export const CanvasComponent = ({
  permGranted,
  video,
  videoReady,
}: {
  permGranted: boolean;
  video: HTMLVideoElement | null;
  videoReady: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div id='container' ref={containerRef}>
      <Canvas
        shadows
        // linear
        ref={canvasRef}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          toneMappingExposure: 0.7,
          physicallyCorrectLights: true,
          toneMapping: ACESFilmicToneMapping,
          // outputEncoding: sRGBEncoding,
        }}
        onCreated={({ scene, gl, camera }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;
          // camera.rotation.reorder('YXZ');
          // camera.updateProjectionMatrix();
        }}
        style={{
          pointerEvents: 'inherit',
          touchAction: 'none',
          width: '100vw',
          height: '100vh',
        }}
        camera={{
          // position: [0, 10, 6],
          aspect:
            canvasRef &&
            (canvasRef.current?.width || 1) / (canvasRef.current?.height || 1),
          fov: 75,
          near: 0.1,
          far: 1000,
          // matrixAutoUpdate: false,
        }}
      >
        <AlvaARComponent
          canvasRef={canvasRef}
          containerRef={containerRef}
          video={video}
          videoReady={videoReady}
        />
      </Canvas>
    </div>
  );
};
