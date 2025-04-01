import { createContext, useContext, useReducer, useEffect } from "react";

const BASE_URL = ``;

const normalizeImagePath = (path) => {
  return path?.startsWith("/uploads") ? `${BASE_URL}${path}` : path;
};

const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const exists = state.cart.find((item) => item._id === action.payload._id);
      if (exists) return state;

      const normalizedProduct = {
        ...action.payload,
        image: normalizeImagePath(action.payload.image),
        additionalImages: (action.payload.additionalImages || []).map(
          normalizeImagePath
        ),
      };

      const updatedCart = [...state.cart, normalizedProduct];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }

    case "REMOVE_FROM_CART": {
      const filteredCart = state.cart.filter(
        (item) => item._id !== action.payload
      );
      localStorage.setItem("cart", JSON.stringify(filteredCart));
      return { cart: filteredCart };
    }

    case "CLEAR_CART":
      localStorage.removeItem("cart");
      return { cart: [] };

    default:
      return state;
  }
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <CartContext.Provider value={{ cart: state.cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
