import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface CanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
}

const Canvas = ({ width = 800, height = 600, onCanvasReady }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Prevent double initialization
    if (fabricCanvasRef.current) return;

    // Initialize Fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#FFF8F0',
      selection: true,
    });

    fabricCanvasRef.current = canvas;

    // Notify parent component that canvas is ready after a small delay
    // to ensure the canvas context is fully initialized
    setTimeout(() => {
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
    }, 0);

    // Cleanup on unmount
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  return (
    <div className="border-4 border-bento-wood rounded-lg shadow-lg">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
