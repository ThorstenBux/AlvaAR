import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import { Matrix4, Quaternion, Vector3 } from 'three';
//@ts-ignore
import { AlvaAR } from './assets/alva_ar.js';

function resize2cover(srcW: number, srcH: number, dstW: number, dstH: number) {
  let rect: { width: number; height: number; x: number; y: number } = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };

  if (dstW / dstH > srcW / srcH) {
    const scale = dstW / srcW;
    rect.width = ~~(scale * srcW);
    rect.height = ~~(scale * srcH);
    rect.x = 0;
    rect.y = ~~((dstH - rect.height) * 0.5);
  } else {
    const scale = dstH / srcH;
    rect.width = ~~(scale * srcW);
    rect.height = ~~(scale * srcH);
    rect.x = ~~((dstW - rect.width) * 0.5);
    rect.y = 0;
  }

  return rect;
}

const applyPose = (
  pose: number[],
  rotationQuaternion?: Quaternion,
  translationVector?: Vector3
) => {
  const m = new Matrix4().fromArray(pose);
  const r = new Quaternion().setFromRotationMatrix(m);
  const t = new Vector3(pose[12], pose[13], pose[14]);

  rotationQuaternion && rotationQuaternion.set(-r.x, r.y, r.z, r.w);
  translationVector && translationVector.set(t.x, -t.y, -t.z);
};

export const useAlvaAR = ({
  video,
  container,
  videoReady,
}: {
  video: HTMLVideoElement | null;
  container: HTMLDivElement | null;
  videoReady: boolean;
}) => {
  const [alva, setAlva] = useState<any>();
  const { canvas, ctx } = useMemo(() => {
    if (!videoReady) return { canvas: undefined };
    const $canvas = document.createElement('canvas');
    document.body.append($canvas);
    const ctx = $canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });
    return { canvas: $canvas, ctx };
  }, [videoReady]);

  const [size, setSize] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>();

  const { camera } = useThree();
  console.log('video', video);

  useFrame(() => {
    if (!alva || !ctx || !video || !size || !camera || !videoReady) return;
    ctx.drawImage(
      video,
      0,
      0,
      video.videoWidth,
      video.videoHeight,
      size.x,
      size.y,
      size.width,
      size.height
    );
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const pose = alva.findCameraPose(frame);
    if (pose) {
      applyPose(pose, camera.quaternion, camera.position);
    } else {
      console.warn('no tracking possible');
    }
  });

  useEffect(() => {
    if (canvas) {
      const alvaAR = AlvaAR.Initialize(canvas.width, canvas.height);
      alvaAR.then((alva: any) => {
        setAlva(alva);
      });
    }
  }, [canvas]);

  useEffect(() => {
    if (!video) return;
    if (video && container && canvas && videoReady) {
      console.log('main', video, container, canvas, videoReady);
      const _size = resize2cover(
        video.videoWidth,
        video.videoHeight,
        container.clientWidth,
        container.clientHeight
      );
      setSize(_size);
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      video.style.width = _size.width + 'px';
      video.style.height = _size.height + 'px';
      const alvaAR = AlvaAR.Initialize(canvas.width, canvas.height);
      alvaAR.then((alva: any) => {
        setAlva(alva);
      });
      // ctx!.drawImage(
      //   video,
      //   0,
      //   0,
      //   video.videoWidth,
      //   video.videoHeight,
      //   _size.x,
      //   _size.y,
      //   _size.width,
      //   _size.height
      // );
    }
  }, [canvas, container, ctx, video, videoReady]);

  return alva;
};
