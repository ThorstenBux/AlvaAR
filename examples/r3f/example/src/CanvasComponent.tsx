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
        linear
        ref={canvasRef}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          physicallyCorrectLights: true,
          toneMapping: ACESFilmicToneMapping,
          outputEncoding: sRGBEncoding,
        }}
        onCreated={({ scene, gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;
        }}
        style={{
          pointerEvents: 'inherit',
          touchAction: 'none',
          width: '100vw',
          height: '100vh',
        }}
        camera={{
          position: [0, 10, 6],
          fov: 75,
          near: 0.1,
          far: 1000,
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
