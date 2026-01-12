import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import Canvas from './components/Canvas';
import BentoBox from './components/BentoBox';
import IngredientPanel from './components/IngredientPanel';
import SaveLoadPanel from './components/SaveLoadPanel';
import AuthModal from './components/AuthModal';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [bentoBoxReady, setBentoBoxReady] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useAuth();

  const handleCanvasReady = (fabricCanvas: fabric.Canvas) => {
    setCanvas(fabricCanvas);
  };

  // Set bentoBoxReady after a small delay to ensure BentoBox is rendered
  useEffect(() => {
    if (canvas) {
      setTimeout(() => {
        setBentoBoxReady(true);
      }, 100);
    }
  }, [canvas]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bento-cream to-bento-rice p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">
                  Welcome, <strong>{user.username}</strong>
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-bento-orange text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          <h1 className="text-5xl font-bold text-bento-dark-wood mb-2">
            Loving Lunch 🍱
          </h1>
          <p className="text-lg text-gray-700">
            Create the perfect bento box puzzle!
          </p>
        </header>

        <div className="flex gap-6 justify-center items-start">
          {bentoBoxReady ? (
            <IngredientPanel canvas={canvas} />
          ) : (
            <div className="w-64 bg-white rounded-lg shadow-lg p-4 border-2 border-bento-wood h-48 flex items-center justify-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          )}

          <div className="flex flex-col items-center">
            <Canvas width={800} height={600} onCanvasReady={handleCanvasReady} />
            {canvas && <BentoBox canvas={canvas} x={100} y={100} width={600} height={400} />}
          </div>

          {bentoBoxReady && <SaveLoadPanel canvas={canvas} />}
        </div>

        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>Drag ingredients into the bento box compartments</p>
        </footer>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

export default App;
