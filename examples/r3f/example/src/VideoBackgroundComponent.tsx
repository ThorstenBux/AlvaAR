import React, { useCallback, useEffect, useRef, useState } from 'react';

export const useVideoBackground = (props: any) => {
  console.log('useVideoBackgorund', props);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState<boolean>(false);

  const deviceCount = (): Promise<{
    videoInCount: number;
    deviceId: string;
  }> => {
    return new Promise((resolve) => {
      let videoInCount = 0;
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          let deviceId: string = '';
          devices.forEach((device) => {
            // @ts-ignore
            if (device.kind === 'video') {
              // legacy support
              videoInCount++;
            }

            if (device.kind === 'videoinput') {
              videoInCount++;
              if (device.label.toLowerCase().includes('back')) {
                deviceId = device.deviceId;
              }
            }
          });
          resolve({ videoInCount, deviceId });
        })
        .catch((err) => {
          // tslint:disable-next-line:no-console
          console.error(err.name + ': ' + err.message);
          // @ts-ignore
          resolve(undefined);
        });
    });
  };

  // https://github.com/webrtc/samples/blob/gh-pages/src/content/devices/input-output/js/main.js
  const initCameraStream = useCallback(
    (
      { videoInCount, deviceId }: { videoInCount: number; deviceId: string },
      video: HTMLVideoElement | null
    ) => {
      if (!video) {
        return;
      }
      let hint: MediaStreamConstraints;
      // stop any active streams in the window
      // if (window.stream) {
      //   window.stream.getTracks().forEach((track) => {
      //     track.stop();
      //   });
      // }
      // We assume desktop
      if (videoInCount === 1 && !deviceId) {
        hint = {
          audio: false,
          video: true,
        };
      } else {
        // mobile
        hint = {
          audio: false,
          // video: {
          //   facingMode: { exact: "environment" },
          // },
          video: true,
        };
        if (deviceId) {
          hint.video = { deviceId: { exact: deviceId } };
        }
      }
      navigator.mediaDevices
        .getUserMedia(hint)
        .then((stream) => {
          video.srcObject = stream;
          video.addEventListener('loadedmetadata', () => {
            video.play();
            console.log('video ready');
            setVideoReady(true);
          });
        })
        .catch((err) => {
          console.error('getUserMedia() error: ', err);
        });
    },
    []
  );
  /**
   * start video camera
   */
  const startVideo = useCallback(
    (video: HTMLVideoElement | null) => {
      if (
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia &&
        //@ts-ignore
        navigator.mediaDevices.enumerateDevices
      ) {
        navigator.mediaDevices
          .getUserMedia({ audio: false, video: true })
          .then((stream) => {
            stream.getTracks().forEach((track) => {
              track.stop();
            });
            deviceCount().then((devicesObject) => {
              // init the camera stream
              initCameraStream(devicesObject, video);
            });
          })
          .catch((err) => {
            console.error("Can't open video", err);
          });
      }
    },
    [initCameraStream]
  );

  useEffect(() => {
    if (props.permGranted) {
      if (videoRef) {
        startVideo(videoRef.current);
      }
    }
  }, [props.permGranted, startVideo, videoRef]);

  return {
    videoElement: (
      <video
        id='video'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
        loop
        autoPlay
        muted
        playsInline
        ref={videoRef}
      ></video>
    ),
    ref: videoRef,
    videoReady,
  };
};
