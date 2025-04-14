import { createContext, useContext, useReducer, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const normalizeImagePath = (path) => {
  return path?.startsWith("http") ? path : "/images/placeholder.jpg";
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
        additionalImages: (action.payload.additionalImages || []).map(normalizeImagePath),
      };

      const updatedCart = [...state.cart, normalizedProduct];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }

    case "REMOVE_FROM_CART": {
      const filteredCart = state.cart.filter((item) => item._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(filteredCart));
      return { cart: filteredCart };
    }

    case "CLEAR_CART":
      localStorage.removeItem("cart");
      return { cart: [] };

    case "SET_CART":
      localStorage.setItem("cart", JSON.stringify(action.payload));
      return { cart: action.payload };

    default:
      return state;
  }
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const filterSoldItems = async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return;

    const ids = cart.map((item) => item._id);

    try {
      const response = await fetch(`${BASE_URL}/api/products/check-sold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      const data = await response.json();

      if (data?.soldIds) {
        const filtered = cart.filter(
          (item) => !data.soldIds.includes(item._id)
        );
        dispatch({ type: "SET_CART", payload: filtered });
      }
    } catch (error) {
      console.error("Error filtering sold items:", error);
    }
  };

  useEffect(() => {
    filterSoldItems();
  }, []);

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