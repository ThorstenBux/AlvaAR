export const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // video: { facingMode }, // This breaks on Samsung s20 (chrome and samsung browser).
        video: true, // So basically we just ask for the camera permissions and then let 8thwall decide which camera to use
        audio: true,
      });
  
      stream.getTracks().forEach((track) => track.stop());
  
      return "granted" as const;
    } catch (error: any) {
      switch (error.name.toLowerCase()) {
        case "notallowederror":
          return "denied" as const;
        case "notreadableerror": // Happens if the camera is used by some other process
          return "denied" as const;
  
        default:
          return "denied" as const;
      }
    }
  };