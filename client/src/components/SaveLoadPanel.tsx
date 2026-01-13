import { useState } from 'react';
import { fabric } from 'fabric';
import { bentoBoxApi } from '../services/api';
import ingredientsData from '../data/ingredients.json';
import { getIngredientIcon } from '../utils/ingredientIcons';
import { Ingredient } from '../types';

interface SaveLoadPanelProps {
  canvas: fabric.Canvas | null;
}

const SaveLoadPanel = ({ canvas }: SaveLoadPanelProps) => {
  const [boxName, setBoxName] = useState('');
  const [savedBoxes, setSavedBoxes] = useState<any[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to create ingredient on canvas from saved data
  const createIngredientFromData = (ingredientId: string, data: any) => {
    if (!canvas) return;

    const ingredientInfo = ingredientsData.find((ing: Ingredient) => ing.id === ingredientId);
    if (!ingredientInfo) return;

    const icon = getIngredientIcon(ingredientId);

    const label = new fabric.Text(icon, {
      fontSize: Math.min(ingredientInfo.width, ingredientInfo.height),
      left: data.position.x,
      top: data.position.y,
      angle: data.rotation,
      scaleX: data.scale.x,
      scaleY: data.scale.y,
      originX: 'center',
      originY: 'center',
      selectable: true,
      hasControls: true,
      hasBorders: true,
      lockRotation: false,
      cornerStyle: 'circle',
      cornerColor: '#FF8C42',
      cornerSize: 10,
      transparentCorners: false,
    });

    (label as any).ingredientData = {
      id: data.id,
      name: data.name,
      category: data.category,
    };

    label.set({
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.3)',
        blur: 5,
        offsetX: 2,
        offsetY: 2,
      }),
    });

    label.on('moving', function(e) {
      const obj = e.transform?.target;
      if (!obj) return;
      const bounds = (canvas as any).bentoBoxBounds;
      if (bounds) {
        const objLeft = obj.left || 0;
        const objTop = obj.top || 0;
        if (objLeft > bounds.left.x && objLeft < bounds.left.x + bounds.left.width && objTop > bounds.left.y && objTop < bounds.left.y + bounds.left.height) {
          obj.set({ opacity: 0.8 });
        } else if (objLeft > bounds.right.x && objLeft < bounds.right.x + bounds.right.width && objTop > bounds.right.y && objTop < bounds.right.y + bounds.right.height) {
          obj.set({ opacity: 0.8 });
        } else {
          obj.set({ opacity: 1 });
        }
      }
    });

    label.on('mouseup', function() {
      label.set({ opacity: 1 });
      canvas.renderAll();
    });

    label.on('mousedblclick', function() {
      canvas.remove(label);
      canvas.renderAll();
    });

    canvas.add(label);
  };

  const generateThumbnail = () => {
    if (!canvas) return '';
    try {
      return canvas.toDataURL({ format: 'png', quality: 0.8, multiplier: 0.3 });
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return '';
    }
  };

  const saveCurrentBox = async () => {
    if (!canvas) return;
    if (!boxName.trim()) {
      setMessage('Please enter a name for your bento box');
      return;
    }

    setIsLoading(true);
    try {
      const objects = canvas.getObjects();
      const ingredients = objects
        .filter((obj: any) => obj.ingredientData)
        .map((obj: any) => ({
          id: obj.ingredientData.id,
          name: obj.ingredientData.name,
          category: obj.ingredientData.category,
          position: {
            x: obj.left || 0,
            y: obj.top || 0,
          },
          rotation: obj.angle || 0,
          scale: {
            x: obj.scaleX || 1,
            y: obj.scaleY || 1,
          },
        }));

      const thumbnail = generateThumbnail();

      const response = await bentoBoxApi.create({
        name: boxName,
        ingredients,
        thumbnail,
        isPublic: false,
      });

      if (response.error) {
        setMessage(`Error: ${response.error}`);
      } else {
        setMessage('✅ Bento box saved successfully!');
        setBoxName('');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedBoxes = async () => {
    setIsLoading(true);
    try {
      const response = await bentoBoxApi.getUserBoxes();
      if (response.error) {
        setMessage(`Error: ${response.error}`);
      } else {
        setSavedBoxes(response.data || []);
        setShowSaved(true);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBox = async (boxId: string) => {
    if (!canvas) return;

    setIsLoading(true);
    try {
      const response = await bentoBoxApi.getById(boxId);
      if (response.error) {
        setMessage(`Error: ${response.error}`);
        return;
      }

      const boxData = response.data;

      // Clear canvas first (only remove ingredients)
      const objects = canvas.getObjects();
      objects.forEach((obj: any) => {
        if (obj.ingredientData) {
          canvas.remove(obj);
        }
      });

      // Recreate all ingredients
      boxData.ingredients.forEach((ingredientData: any) => {
        createIngredientFromData(ingredientData.id, ingredientData);
      });

      canvas.renderAll();
      setMessage(`✅ Loaded "${boxData.name}" successfully!`);
      setShowSaved(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBox = async (boxId: string, boxName: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${boxName}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await bentoBoxApi.delete(boxId);
      if (response.error) {
        setMessage(`Error: ${response.error}`);
      } else {
        setMessage(`✅ Deleted "${boxName}" successfully!`);
        setSavedBoxes(savedBoxes.filter(box => box._id !== boxId));
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCanvas = () => {
    if (!canvas) return;

    if (!confirm('Are you sure you want to clear all ingredients?')) {
      return;
    }

    const objects = canvas.getObjects();
    objects.forEach((obj: any) => {
      if (obj.ingredientData) {
        canvas.remove(obj);
      }
    });
    canvas.renderAll();
    setMessage('✅ Canvas cleared!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="w-72 bg-white rounded-lg shadow-lg p-4 border-2 border-bento-wood">
      <h2 className="text-xl font-bold text-bento-dark-wood mb-4">Save / Load</h2>

      {message && (
        <div className={`mb-3 p-2 rounded text-xs ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold mb-1">Box Name</label>
          <input
            type="text"
            value={boxName}
            onChange={(e) => setBoxName(e.target.value)}
            placeholder="My Amazing Bento"
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bento-orange disabled:opacity-50"
          />
        </div>

        <button
          onClick={saveCurrentBox}
          disabled={isLoading}
          className="w-full bg-bento-orange text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '⏳ Saving...' : '💾 Save Current Box'}
        </button>

        <button
          onClick={loadSavedBoxes}
          disabled={isLoading}
          className="w-full bg-bento-green text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '⏳ Loading...' : '📂 Load Saved Boxes'}
        </button>

        <button
          onClick={clearCanvas}
          disabled={isLoading}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🗑️ Clear Canvas
        </button>

        {showSaved && (
          <div className="mt-4 max-h-64 overflow-y-auto border-t pt-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold">Your Saved Boxes:</h3>
              <button
                onClick={() => setShowSaved(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                ✕ Close
              </button>
            </div>
            {savedBoxes.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No saved boxes yet</p>
            ) : (
              <div className="space-y-2">
                {savedBoxes.map((box) => (
                  <div
                    key={box._id}
                    className="p-2 bg-bento-cream rounded border border-bento-wood cursor-pointer hover:bg-bento-rice transition-colors group"
                  >
                    <div onClick={() => loadBox(box._id)}>
                      {box.thumbnail && (
                        <img
                          src={box.thumbnail}
                          alt={box.name}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                      )}
                      <p className="text-sm font-semibold">{box.name}</p>
                      <p className="text-xs text-gray-500">
                        {box.ingredients.length} ingredients
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteBox(box._id, box.name, e)}
                      className="mt-2 w-full text-xs text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-gray-700 font-semibold mb-1">
          💡 Tips:
        </p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Login to save/load boxes</li>
          <li>• Thumbnails auto-generated</li>
          <li>• Click box to load it</li>
          <li>• Hover to show delete button</li>
        </ul>
      </div>
    </div>
  );
};

export default SaveLoadPanel;
