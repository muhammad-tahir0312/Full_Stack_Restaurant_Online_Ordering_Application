import { ActionTypes, CartType } from "../types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_STATE = {
  products: [],
  totalItems: 0,
  totalPrice: 0,
};

export const useCartStore = create(
  persist<CartType & ActionTypes>(
    (set, get) => ({
      products: INITIAL_STATE.products,
      totalItems: INITIAL_STATE.totalItems,
      totalPrice: INITIAL_STATE.totalPrice,
      addToCart(item) {
        const products = get().products;
        const productInState = products.find(
          (product) => product.id === item.id
        );

        if (productInState) {
          const updatedProducts = products.map((product) =>
            product.id === productInState.id
              ? {
                  ...item,
                  quantity: Number(item.quantity) + Number(product.quantity),
                  price: Number(item.price) + Number(product.price),
                }
              : item
          );
          set((state) => ({
            products: updatedProducts,
            totalItems: Number(state.totalItems) + Number(item.quantity),
            totalPrice: Number(state.totalPrice) + Number(item.price),
          }));
        } else {
          set((state) => ({
            products: [...state.products, item],
            totalItems: Number(state.totalItems) + Number(item.quantity),
            totalPrice: Number(state.totalPrice) + Number(item.price),
          }));
        }
      },
      removeFromCart(item) {
        set((state) => {
          const updatedProducts = state.products.filter(
            (product) => product.id !== item.id
          );
          const totalPrice =
          Number(updatedProducts.length) === 0
              ? 0
              : Number(state.totalPrice) - Number(item.price);
          return {
            products: updatedProducts,
            totalItems: Number(state.totalItems) - Number(item.quantity),
            totalPrice: Number(totalPrice),
          };
        });
      },
    }),
    { name: "cart", skipHydration: true }
  )
);
