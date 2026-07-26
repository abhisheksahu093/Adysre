/**
 * On-device face detection with MediaPipe (BlazeFace short-range).
 *
 * The WASM runtime and the .tflite model are vendored under
 * `public/models/mediapipe`, so detection runs offline and no image is ever
 * uploaded. The detector is created once and reused across a batch. The library
 * is dynamic-imported so its weight loads only when a face tool runs.
 */

export interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const WASM_PATH = '/models/mediapipe/wasm';
const MODEL_PATH = '/models/mediapipe/blaze_face_short_range.tflite';

interface FaceDetectorLike {
  detect(source: HTMLCanvasElement | ImageBitmap): {
    detections: { boundingBox?: { originX: number; originY: number; width: number; height: number } }[];
  };
}

let detectorPromise: Promise<FaceDetectorLike> | null = null;

async function getDetector(): Promise<FaceDetectorLike> {
  detectorPromise ??= (async () => {
    const { FilesetResolver, FaceDetector } = await import('@mediapipe/tasks-vision');
    const vision = await FilesetResolver.forVisionTasks(WASM_PATH);
    return (await FaceDetector.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL_PATH },
      runningMode: 'IMAGE',
      minDetectionConfidence: 0.4,
    })) as unknown as FaceDetectorLike;
  })();
  return detectorPromise;
}

/** Detect faces in a canvas or bitmap; returns pixel-space bounding boxes. */
export async function detectFaces(source: HTMLCanvasElement | ImageBitmap): Promise<FaceBox[]> {
  const detector = await getDetector();
  const result = detector.detect(source);
  return result.detections
    .map((d) => d.boundingBox)
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
    .map((b) => ({ x: b.originX, y: b.originY, width: b.width, height: b.height }));
}
