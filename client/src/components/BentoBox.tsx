import { useEffect } from 'react';
import { fabric } from 'fabric';

interface BentoBoxProps {
  canvas: fabric.Canvas | null;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

const BentoBox = ({ canvas, x = 100, y = 100, width = 600, height = 400 }: BentoBoxProps) => {
  useEffect(() => {
    if (!canvas) return;

    // Create the main bento box container
    const boxBackground = new fabric.Rect({
      left: x,
      top: y,
      width: width,
      height: height,
      fill: '#D4A574',
      stroke: '#A67C52',
      strokeWidth: 6,
      rx: 10,
      ry: 10,
      selectable: false,
      evented: false,
    });

    // Create inner shadow effect
    const innerShadow = new fabric.Rect({
      left: x + 10,
      top: y + 10,
      width: width - 20,
      height: height - 20,
      fill: '#E8D4B8',
      stroke: '#C9A961',
      strokeWidth: 2,
      rx: 5,
      ry: 5,
      selectable: false,
      evented: false,
    });

    // Create divider between two compartments
    const divider = new fabric.Rect({
      left: x + width / 2 - 3,
      top: y + 15,
      width: 6,
      height: height - 30,
      fill: '#A67C52',
      selectable: false,
      evented: false,
    });

    // Left compartment (slightly lighter background)
    const leftCompartment = new fabric.Rect({
      left: x + 15,
      top: y + 15,
      width: width / 2 - 20,
      height: height - 30,
      fill: '#F5F5DC',
      stroke: '#D4A574',
      strokeWidth: 1,
      rx: 3,
      ry: 3,
      selectable: false,
      evented: false,
      opacity: 0.3,
    });

    // Right compartment (slightly lighter background)
    const rightCompartment = new fabric.Rect({
      left: x + width / 2 + 5,
      top: y + 15,
      width: width / 2 - 20,
      height: height - 30,
      fill: '#F5F5DC',
      stroke: '#D4A574',
      strokeWidth: 1,
      rx: 3,
      ry: 3,
      selectable: false,
      evented: false,
      opacity: 0.3,
    });

    // Add all elements to canvas
    canvas.add(boxBackground);
    canvas.add(innerShadow);
    canvas.add(leftCompartment);
    canvas.add(rightCompartment);
    canvas.add(divider);

    canvas.renderAll();

    // Store compartment boundaries for drag detection
    (canvas as any).bentoBoxBounds = {
      left: {
        x: x + 15,
        y: y + 15,
        width: width / 2 - 20,
        height: height - 30,
      },
      right: {
        x: x + width / 2 + 5,
        y: y + 15,
        width: width / 2 - 20,
        height: height - 30,
      },
    };

    // Cleanup function
    return () => {
      canvas.remove(boxBackground);
      canvas.remove(innerShadow);
      canvas.remove(leftCompartment);
      canvas.remove(rightCompartment);
      canvas.remove(divider);
    };
  }, [canvas, x, y, width, height]);

  return null;
};

export default BentoBox;
