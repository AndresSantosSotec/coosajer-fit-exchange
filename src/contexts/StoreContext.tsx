import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  fitcoins: number;
  category: string;
  size?: string;
  brand?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  products: Product[];
  cart: CartItem[];
  balance: number;
  filters: {
    search: string;
    minPrice: number;
    maxPrice: number;
    categories: string[];
    sizes: string[];
    brand: string;
  };
  isCartOpen: boolean;
  isTicketModalOpen: boolean;
}

type StoreAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_FILTERS'; payload: Partial<StoreState['filters']> }
  | { type: 'TOGGLE_CART' }
  | { type: 'TOGGLE_TICKET_MODAL' }
  | { type: 'PROCESS_PURCHASE' };

const initialState: StoreState = {
  products: [
    {
      id: '1',
      name: 'Nike Air Max Running',
      description: 'Zapatillas deportivas con amortiguación avanzada para correr',
      image: '/api/placeholder/300/300',
      fitcoins: 45,
      category: 'Calzado',
      size: 'M',
      brand: 'Nike'
    },
    {
      id: '2',
      name: 'Adidas Performance Camiseta',
      description: 'Camiseta técnica de alto rendimiento con tecnología Dry-Fit',
      image: '/api/placeholder/300/300',
      fitcoins: 25,
      category: 'Ropa',
      size: 'L',
      brand: 'Adidas'
    },
    {
      id: '3',
      name: 'Under Armour Mancuernas 5kg',
      description: 'Set de mancuernas con recubrimiento de neopreno antideslizante',
      image: '/api/placeholder/300/300',
      fitcoins: 35,
      category: 'Accesorios',
      brand: 'Under Armour'
    },
    {
      id: '4',
      name: 'Puma Training Shorts',
      description: 'Shorts deportivos con tecnología de secado rápido',
      image: '/api/placeholder/300/300',
      fitcoins: 20,
      category: 'Ropa',
      size: 'M',
      brand: 'Puma'
    },
    {
      id: '5',
      name: 'Reebok Yoga Mat Premium',
      description: 'Esterilla de yoga antideslizante de 6mm de grosor',
      image: '/api/placeholder/300/300',
      fitcoins: 30,
      category: 'Accesorios',
      brand: 'Reebok'
    },
    {
      id: '6',
      name: 'Nike Pro Leggings',
      description: 'Mallas de compresión para entrenamiento de alta intensidad',
      image: '/api/placeholder/300/300',
      fitcoins: 40,
      category: 'Ropa',
      size: 'S',
      brand: 'Nike'
    }
  ],
  cart: [],
  balance: 250,
  filters: {
    search: '',
    minPrice: 0,
    maxPrice: 100,
    categories: [],
    sizes: [],
    brand: ''
  },
  isCartOpen: false,
  isTicketModalOpen: false
};

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case 'TOGGLE_CART':
      return {
        ...state,
        isCartOpen: !state.isCartOpen
      };
    case 'TOGGLE_TICKET_MODAL':
      return {
        ...state,
        isTicketModalOpen: !state.isTicketModalOpen
      };
    case 'PROCESS_PURCHASE': {
      const total = state.cart.reduce((sum, item) => sum + (item.fitcoins * item.quantity), 0);
      return {
        ...state,
        balance: state.balance - total,
        cart: [],
        isCartOpen: false,
        isTicketModalOpen: true
      };
    }
    default:
      return state;
  }
}

const StoreContext = createContext<{
  state: StoreState;
  dispatch: React.Dispatch<StoreAction>;
} | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}