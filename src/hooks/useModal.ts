import { useState } from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const register = { open: isOpen, onClose: close };
  return { isOpen, setIsOpen, toggle, open, close, register };
};
