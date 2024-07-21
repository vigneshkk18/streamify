import { create } from "zustand";

export const useMenu = create(() => false);

export const openMenu = () => {
  useMenu.setState(true);
};

export const closeMenu = () => {
  useMenu.setState(false);
};

export const setMenu = (isOpen: boolean) => {
  useMenu.setState(isOpen);
};
