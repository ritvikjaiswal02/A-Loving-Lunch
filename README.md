# Loving Lunch 🍱 - Bento Box Puzzle Game

A delightful full-stack MERN puzzle game where you create beautiful bento boxes by arranging ingredients in compartments. Features drag-and-drop gameplay, rotation/resize controls, and save/load functionality with user authentication.

## Project Structure

```
loving-lunch/
├── client/                      # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/         # Canvas, BentoBox, IngredientPanel, SaveLoadPanel
│   │   ├── data/               # ingredients.json
│   │   ├── services/           # API client
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # Helper functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/                      # Express + TypeScript + MongoDB
│   ├── src/
│   │   ├── controllers/        # authController, bentoBoxController
│   │   ├── middleware/         # auth middleware
│   │   ├── models/             # User, BentoBox
│   │   ├── routes/             # API routes
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## ✨ Features

### Frontend Features ✅
- **All 10 Ingredients**: Rice, proteins, vegetables, and garnishes
- **Clone-on-Drag**: Click to add unlimited copies of any ingredient
- **Full Control**: Drag, rotate, resize, and delete ingredients
- **Different Shapes**: Circles (rice), rectangles (protein), ellipses (vegetables)
- **Visual Feedback**: Opacity changes when hovering over bento box
- **Category Organization**: Ingredients grouped by type
- **Save/Load Panel**: UI for saving and loading bento box designs

### Backend Features ✅
- **Express REST API**: Full CRUD operations for bento boxes
- **User Authentication**: JWT-based auth with bcrypt password hashing
- **MongoDB Integration**: User and BentoBox models with Mongoose
- **Protected Routes**: Middleware for secure API endpoints
- **Public Sharing**: Option to make bento boxes public

### Game Mechanics ✅
- Click any ingredient to add it to the canvas
- Drag ingredients around the bento box
- Use corner handles to rotate and resize
- Double-click any ingredient to delete it
- Save your creations (requires backend)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1. Install Client Dependencies
```bash
cd client
npm install
```

#### 2. Install Server Dependencies
```bash
cd ../server
npm install
```

#### 3. Set Up Environment Variables

**Client** (create `client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

**Server** (create `server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/loving-lunch
JWT_SECRET=your-secret-key-change-this
NODE_ENV=development
```

#### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using local MongoDB
mongod
```

#### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

#### 6. Open in Browser
- Frontend: http://localhost:3002 (or 3000/3001)
- Backend API: http://localhost:5000/api/health

## 🎮 How to Play

1. **Add Ingredients**: Click any ingredient in the left panel
2. **Move**: Drag ingredients around the canvas
3. **Rotate/Resize**: Use the orange corner handles
4. **Delete**: Double-click any ingredient
5. **Save**: Enter a name and click "Save Current Box"
6. **Load**: Click "Load Saved Boxes" to see your creations

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Fabric.js** - Canvas manipulation
- **Tailwind CSS** - Styling

### Backend
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **TypeScript** - Type safety

## Color Palette

- `bento-cream`: #FFF8F0 (background)
- `bento-wood`: #D4A574 (box color)
- `bento-dark-wood`: #A67C52 (borders)
- `bento-rice`: #F5F5DC (compartments)
- `bento-seaweed`: #2C5F2D
- `bento-salmon`: #FA8072
- `bento-orange`: #FF8C42
- `bento-green`: #7FB069

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Bento Boxes
- `POST /api/bentoboxes` - Create new bento box (protected)
- `GET /api/bentoboxes/my` - Get user's boxes (protected)
- `GET /api/bentoboxes/public` - Get public boxes (protected)
- `GET /api/bentoboxes/:id` - Get single box (protected)
- `PUT /api/bentoboxes/:id` - Update box (protected)
- `DELETE /api/bentoboxes/:id` - Delete box (protected)

## 🎯 Future Enhancements

- [ ] User login/register UI
- [ ] Snap-to-grid functionality
- [ ] Collision detection
- [ ] Puzzle/challenge mode with target patterns
- [ ] Level system with different box layouts
- [ ] Leaderboard and social features
- [ ] Image upload for custom ingredients
- [ ] Export as image/PDF

## Contributing

This is a learning project. Feel free to fork and experiment!

## License

MIT
