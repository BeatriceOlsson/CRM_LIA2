import { useCallback } from "react";
import { DeleteContext } from "./useDeleteContext";
import CommunicateBackend from "../communicateBackend";

export function DeleteProvider({ children }) {
  const deleteHandler = useCallback(async (type, id) => {
    if (!type || !id)
      return {
        success: false,
        message: "Kunde inte hitta data som behövs för radering.",
      };

    let url;
    let idKey;
    switch (type) {
      case "CP":
        url = "/contactPerson/delete";
        idKey = "contactPersonID";
        break;
      case "CL":
        url = "/company/delete";
        idKey = "companyID";
        break;
      case "sales":
        url = "/sales/delete";
        idKey = "salesID";
        break;
      default:
        return { success: false, message: "Okänd datatyp för radering." };
    }

    try {
      const response = await CommunicateBackend({
        url,
        crud: "POST",
        body: { [idKey]: Number(id) },
      });

      if (response instanceof Error) {
        return {
          success: false,
          message: "Ett fel uppstod vid radering.",
        };
      }

      return {
        success: true,
        message: "Raderingen genomfördes.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Ett fel uppstod vid radering.",
        error,
      };
    }
  }, []);

  const data = {
    deleteHandler,
  };
  return (
    <DeleteContext.Provider value={data}>{children}</DeleteContext.Provider>
  );
}
