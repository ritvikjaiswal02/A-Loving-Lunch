import { useState } from 'react';
import { fabric } from 'fabric';
import { Ingredient } from '../types';
import ingredientsData from '../data/ingredients.json';
import { getIngredientIcon } from '../utils/ingredientIcons';

interface IngredientPanelProps {
  canvas: fabric.Canvas | null;
}

const IngredientPanel = ({ canvas }: IngredientPanelProps) => {
  const [ingredients] = useState<Ingredient[]>(ingredientsData);

  const createIngredientOnCanvas = (ingredient: Ingredient, x: number, y: number) => {
    if (!canvas) return;

    const icon = getIngredientIcon(ingredient.id);
    const width = ingredient.width;
    const height = ingredient.height;

    // Create just the emoji text
    const label = new fabric.Text(icon, {
      fontSize: Math.min(width, height),
      left: x,
      top: y,
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
      id: ingredient.id,
      name: ingredient.name,
      category: ingredient.category,
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

        if (
          objLeft > bounds.left.x &&
          objLeft < bounds.left.x + bounds.left.width &&
          objTop > bounds.left.y &&
          objTop < bounds.left.y + bounds.left.height
        ) {
          obj.set({ opacity: 0.8 });
        } else if (
          objLeft > bounds.right.x &&
          objLeft < bounds.right.x + bounds.right.width &&
          objTop > bounds.right.y &&
          objTop < bounds.right.y + bounds.right.height
        ) {
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
    canvas.setActiveObject(label);
    canvas.renderAll();
  };

  const handleIngredientClick = (ingredient: Ingredient) => {
    if (!canvas) return;
    const x = 400;
    const y = 300;
    createIngredientOnCanvas(ingredient, x, y);
  };

  const groupedIngredients = ingredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.category]) {
      acc[ingredient.category] = [];
    }
    acc[ingredient.category].push(ingredient);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  const categoryColors: Record<string, string> = {
    rice: 'bg-bento-rice',
    protein: 'bg-bento-salmon',
    vegetable: 'bg-bento-green',
    garnish: 'bg-bento-orange',
  };

  const categoryLabels: Record<string, string> = {
    rice: 'Rice',
    protein: 'Protein',
    vegetable: 'Vegetables',
    garnish: 'Garnish',
  };

  return (
    <div className="w-72 bg-white rounded-lg shadow-lg p-4 border-2 border-bento-wood max-h-[600px] overflow-y-auto">
      <h2 className="text-xl font-bold text-bento-dark-wood mb-4">Ingredients</h2>

      {Object.entries(groupedIngredients).map(([category, items]) => (
        <div key={category} className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            {categoryLabels[category]}
          </h3>
          <div className="space-y-2">
            {items.map((ingredient) => (
              <div
                key={ingredient.id}
                onClick={() => handleIngredientClick(ingredient)}
                className="flex items-center space-x-3 p-2 bg-bento-cream rounded-lg border border-bento-wood cursor-pointer hover:bg-bento-rice transition-all hover:shadow-md active:scale-95"
              >
                <div className="w-10 h-10 flex items-center justify-center text-2xl">
                  {getIngredientIcon(ingredient.id)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-xs">{ingredient.name}</p>
                  <p className="text-xs text-gray-500">{ingredient.width}×{ingredient.height}</p>
                </div>
                <div className="text-bento-orange text-xs">+</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-gray-700 font-semibold mb-1">
          💡 Quick Tips:
        </p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Click to add ingredient</li>
          <li>• Drag to move</li>
          <li>• Double-click to delete</li>
          <li>• Corners to rotate/resize</li>
        </ul>
      </div>
    </div>
  );
};

export default IngredientPanel;
