export interface Ingredient {
  id: string;
  name: string;
  category: 'rice' | 'protein' | 'vegetable' | 'garnish';
  imageUrl: string;
  primaryColor: string;
  width: number;
  height: number;
}

export interface BentoBox {
  id: string;
  name: string;
  compartments: Compartment[];
}

export interface Compartment {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
