import { useState } from 'react';
import { fabric } from 'fabric';
import { bentoBoxApi } from '../services/api';

interface SaveLoadPanelProps {
  canvas: fabric.Canvas | null;
}

const SaveLoadPanel = ({ canvas }: SaveLoadPanelProps) => {
  const [boxName, setBoxName] = useState('');
  const [savedBoxes, setSavedBoxes] = useState<any[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [message, setMessage] = useState('');

  const saveCurrentBox = async () => {
    if (!canvas) return;
    if (!boxName.trim()) {
      setMessage('Please enter a name for your bento box');
      return;
    }

    try {
      // Get all objects from canvas
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

      const response = await bentoBoxApi.create({
        name: boxName,
        ingredients,
        isPublic: false,
      });

      if (response.error) {
        setMessage(`Error: ${response.error}`);
      } else {
        setMessage('Bento box saved successfully!');
        setBoxName('');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const loadSavedBoxes = async () => {
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
    }
  };

  const loadBox = async (boxId: string) => {
    if (!canvas) return;

    try {
      const response = await bentoBoxApi.getById(boxId);
      if (response.error) {
        setMessage(`Error: ${response.error}`);
      } else {
        // Clear canvas first
        const objects = canvas.getObjects();
        objects.forEach((obj: any) => {
          if (obj.ingredientData) {
            canvas.remove(obj);
          }
        });

        // Load ingredients (simplified - would need full ingredient recreation logic)
        setMessage('Box loaded! (Note: Full loading implementation pending)');
        setShowSaved(false);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bento-orange"
          />
        </div>

        <button
          onClick={saveCurrentBox}
          className="w-full bg-bento-orange text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all active:scale-95"
        >
          💾 Save Current Box
        </button>

        <button
          onClick={loadSavedBoxes}
          className="w-full bg-bento-green text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all active:scale-95"
        >
          📂 Load Saved Boxes
        </button>

        {showSaved && (
          <div className="mt-4 max-h-48 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-2">Your Saved Boxes:</h3>
            {savedBoxes.length === 0 ? (
              <p className="text-xs text-gray-500">No saved boxes yet</p>
            ) : (
              <div className="space-y-2">
                {savedBoxes.map((box) => (
                  <div
                    key={box._id}
                    onClick={() => loadBox(box._id)}
                    className="p-2 bg-bento-cream rounded border border-bento-wood cursor-pointer hover:bg-bento-rice transition-colors"
                  >
                    <p className="text-sm font-semibold">{box.name}</p>
                    <p className="text-xs text-gray-500">
                      {box.ingredients.length} ingredients
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-xs text-gray-700">
          ⚠️ <strong>Note:</strong> You need to be logged in to save/load boxes. This feature requires the backend server to be running with MongoDB.
        </p>
      </div>
    </div>
  );
};

export default SaveLoadPanel;
