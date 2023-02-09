export const requestMotionPermission = async (): Promise<string> => {
  if (
    // @ts-ignore
    DeviceOrientationEvent.requestPermission &&
    // @ts-ignore
    DeviceMotionEvent.requestPermission
  ) {
    try {
      const permissionState =
        // @ts-ignore
        (await DeviceOrientationEvent.requestPermission()) as string;
      const motionPermissionState =
        // @ts-ignore
        (await DeviceMotionEvent.requestPermission()) as string;
      console.log('permissionState', permissionState, motionPermissionState);
      return permissionState;
    } catch (error: any) {
      switch (error.name) {
        case 'NotAllowedError':
          return 'denied' as const;
        default:
          return 'denied' as const;
      }
    }
  } else {
    return 'granted';
  }
};
