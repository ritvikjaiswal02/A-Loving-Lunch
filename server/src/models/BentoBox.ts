import mongoose, { Document, Schema } from 'mongoose';

export interface IIngredient {
  id: string;
  name: string;
  category: string;
  position: {
    x: number;
    y: number;
  };
  rotation: number;
  scale: {
    x: number;
    y: number;
  };
}

export interface IBentoBox extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  ingredients: IIngredient[];
  thumbnail?: string;
  isPublic: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ingredientSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  rotation: { type: Number, default: 0 },
  scale: {
    x: { type: Number, default: 1 },
    y: { type: Number, default: 1 },
  },
});

const bentoBoxSchema = new Schema<IBentoBox>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  ingredients: [ingredientSchema],
  thumbnail: {
    type: String,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
bentoBoxSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IBentoBox>('BentoBox', bentoBoxSchema);
