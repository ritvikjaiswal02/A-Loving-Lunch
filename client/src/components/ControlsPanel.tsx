import { useState, useEffect } from 'react';
import { fabric } from 'fabric';

interface ControlsPanelProps {
  canvas: fabric.Canvas | null;
}

const ControlsPanel = ({ canvas }: ControlsPanelProps) => {
  const [ingredientCount, setIngredientCount] = useState(0);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Update ingredient count
  useEffect(() => {
    if (!canvas) return;

    const updateCount = () => {
      const objects = canvas.getObjects();
      const count = objects.filter((obj: any) => obj.ingredientData).length;
      setIngredientCount(count);
    };

    // Initial count
    updateCount();

    // Listen for canvas changes
    canvas.on('object:added', updateCount);
    canvas.on('object:removed', updateCount);

    return () => {
      canvas.off('object:added', updateCount);
      canvas.off('object:removed', updateCount);
    };
  }, [canvas]);

  // Toggle snap to grid
  useEffect(() => {
    if (!canvas) return;
    (canvas as any).snapToGrid = snapToGrid;
  }, [canvas, snapToGrid]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!canvas) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key - remove selected object
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObject = canvas.getActiveObject();
        if (activeObject && (activeObject as any).ingredientData) {
          canvas.remove(activeObject);
          canvas.renderAll();
        }
      }

      // Escape key - deselect
      if (e.key === 'Escape') {
        canvas.discardActiveObject();
        canvas.renderAll();
      }

      // Ctrl/Cmd + Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
      if (((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) ||
          ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        redo();
      }

      // Ctrl/Cmd + A - Select all ingredients
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        const objects = canvas.getObjects().filter((obj: any) => obj.ingredientData);
        if (objects.length > 0) {
          const selection = new fabric.ActiveSelection(objects, { canvas });
          canvas.setActiveObject(selection);
          canvas.renderAll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas, history, historyStep]);

  // Save canvas state for undo/redo
  const saveState = () => {
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON(['ingredientData']));
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(json);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  // Undo
  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      loadState(history[historyStep - 1]);
    }
  };

  // Redo
  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      loadState(history[historyStep + 1]);
    }
  };

  // Load canvas state
  const loadState = (state: string) => {
    if (!canvas) return;
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
    });
  };

  // Save state on canvas modifications
  useEffect(() => {
    if (!canvas) return;

    const handleModified = () => {
      saveState();
    };

    canvas.on('object:added', handleModified);
    canvas.on('object:removed', handleModified);
    canvas.on('object:modified', handleModified);

    return () => {
      canvas.off('object:added', handleModified);
      canvas.off('object:removed', handleModified);
      canvas.off('object:modified', handleModified);
    };
  }, [canvas]);

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-4 border-2 border-bento-wood">
      <div className="flex items-center gap-6">
        {/* Ingredient Count */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍱</span>
          <div>
            <p className="text-xs text-gray-600">Ingredients</p>
            <p className="text-lg font-bold text-bento-dark-wood">{ingredientCount}</p>
          </div>
        </div>

        <div className="h-8 w-px bg-gray-300"></div>

        {/* Snap to Grid Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
              snapToGrid
                ? 'bg-bento-orange text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {snapToGrid ? '🔲 Grid: ON' : '🔲 Grid: OFF'}
          </button>
        </div>

        <div className="h-8 w-px bg-gray-300"></div>

        {/* Keyboard Shortcuts Info */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-600">
            <p><kbd className="px-1 py-0.5 bg-gray-100 rounded border">Del</kbd> Delete</p>
          </div>
          <div className="text-xs text-gray-600">
            <p><kbd className="px-1 py-0.5 bg-gray-100 rounded border">Esc</kbd> Deselect</p>
          </div>
          <div className="text-xs text-gray-600">
            <p><kbd className="px-1 py-0.5 bg-gray-100 rounded border">Ctrl+Z</kbd> Undo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsPanel;
