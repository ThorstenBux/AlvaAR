import React, { createRef, useEffect, useState } from 'react';
import './App.css';
import { PermissionGuard } from './PermissionGuardComponent';
import { requestMotionPermission } from './motionPermission';
import { requestCameraPermission } from './cameraPermission';
import { CanvasComponent } from './CanvasComponent';
import {
  useVideoBackground,
  // VideoBackgroundComponent,
} from './VideoBackgroundComponent';

function App() {
  const [cameraPermission, setCameraPermission] = useState<
    'pending' | 'granted' | 'denied'
  >('pending');
  const [motionPermission, setMotionPermission] = useState<
    'pending' | 'granted' | 'denied'
  >('pending');
  const [permGranted, setPermGranted] = useState<boolean>(false);

  // Effect for permissions
  React.useEffect(() => {
    if (cameraPermission === 'pending' || motionPermission === 'pending')
      return;
    if (cameraPermission === 'granted' && motionPermission === 'granted') {
      setPermGranted(true);
      return;
    }
  }, [cameraPermission, motionPermission]);
  const { videoElement, ref, videoReady } = useVideoBackground({ permGranted });
  console.log('video', ref, videoElement, videoReady);

  return (
    <div
      className='App'
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <div id='canvas-container'>
        {!permGranted && (
          <PermissionGuard
            start={() => {
              requestMotionPermission().then((motionPermission: string) => {
                setMotionPermission(motionPermission as any);
                requestCameraPermission().then((cameraPermission: string) => {
                  setCameraPermission(cameraPermission as any);
                });
              });
            }}
          ></PermissionGuard>
        )}
        <CanvasComponent
          permGranted={permGranted}
          video={ref && ref.current}
          videoReady={videoReady}
        />
        {/* <VideoBackgroundComponent ref={videoRef} permGranted={permGranted} /> */}
        <div>{videoElement}</div>
      </div>
    </div>
  );
}

export default App;
