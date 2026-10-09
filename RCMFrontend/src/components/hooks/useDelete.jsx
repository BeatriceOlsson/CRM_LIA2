import { useContext } from "react";
import { DeleteContext } from "../context/useDeleteContext";

export function useDelete() {
  const context = useContext(DeleteContext);

  if (!context) {
    throw new Error("useDelete must be used inside DeleteProvider");
  }

  return context;
}
