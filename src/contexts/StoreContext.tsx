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
  | { type: 'PROCESS_PURCHASE' }
  | { type: 'SET_BALANCE'; payload: number }; // <-- NUEVA ACCIÓN

const initialState: StoreState = {
  products: [],
  cart: [],
  balance: 0,
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
        cart: state.cart
          .map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: Math.max(0, action.payload.quantity) }
              : item
          )
          .filter(item => item.quantity > 0)
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
      const total = state.cart.reduce(
        (sum, item) => sum + item.fitcoins * item.quantity,
        0
      );
      return {
        ...state,
        balance: state.balance - total,
        cart: [],
        isCartOpen: false,
        isTicketModalOpen: true
      };
    }
    case 'SET_BALANCE':
      // (Opcional) Evitar renders innecesarios si no cambia:
      if (state.balance === action.payload) return state;
      return { ...state, balance: action.payload };
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

// (Opcional) Action creators para mayor limpieza:
export const setBalance = (amount: number): StoreAction => ({ type: 'SET_BALANCE', payload: amount });
export const processPurchase = (): StoreAction => ({ type: 'PROCESS_PURCHASE' });