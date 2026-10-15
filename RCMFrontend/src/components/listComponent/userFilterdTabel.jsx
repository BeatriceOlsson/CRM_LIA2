import { useEffect, useState } from "react";
import { useUserInfo } from "../hooks/useUserInfo";
import CommunicateBackend from "../communicateBackend";
import { TablesComponent } from "./tablesComponent";
import { ErrorHandler } from "../smallComponents/errorHandler";

export function UserFilterTabel() {
  const { userInformation } = useUserInfo();
  const [errorMessage, setErrorMessage] = useState("");
  const [salesUserData, setSalesUserData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [ondSales, setOndSales] = useState([]);

  useEffect(() => {
    const getUserSales = async () => {
      const filter = { contactPersonID: userInformation.contactPersonID };
      const userFilter = { userID: userInformation.userID };

      try {
        const responsData = await CommunicateBackend({
          url: "/filter/filterSales",
          crud: "POST",
          body: filter,
        });
        let userData = [];
        if (userFilter.userID) {
          userData = await CommunicateBackend({
            url: "/filter/filterSales",
            crud: "POST",
            body: userFilter,
          });
        }

        if (responsData instanceof Error) {
          setErrorMessage(responsData);
        }

        if (userData instanceof Error) {
          setErrorMessage(userData);
        }
        if (!Array.isArray(responsData)) {
          throw new Error("Kunde inte hämta försäljningar.");
        }

        setSalesUserData(responsData);
        setOndSales(userData);
      } catch (error) {
        setErrorMessage(error);
      }
    };

    getUserSales();
  }, []);

  const handelDelete = (id) => {
    setSalesUserData((prev) =>
      prev.filter((item) => {
        return item.salesID !== id;
      }),
    );
    setOndSales((prev) =>
      prev.filter((item) => {
        return item.salesID !== id;
      }),
    );
  };

  const handelSorting = (key, list) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === "asc";
    const newDirection = isAsc ? "desc" : "asc";

    const targetList = list === "sales" ? salesUserData : ondSales;

    const sorted = [...targetList].sort((a, b) => {
      let valA = a[key] ?? "";
      let valB = b[key] ?? "";

      if (typeof valA === "number") {
        return newDirection === "asc" ? valA - valB : valB - valA;
      }

      const compare = String(valA).localeCompare(String(valB), "sv");
      return newDirection === "asc" ? compare : -compare;
    });

    if (list === "sales") {
      setSalesUserData(sorted);
    } else {
      setOndSales(sorted);
    }
    setSortConfig({ key, direction: newDirection });
  };

  return (
    <div>
      <div className="mx-10 my-5">
        {salesUserData.length > 0 && (
          <div>
            <h2 className="text-xl mb-3">Motagna försäljninngar:</h2>
            <TablesComponent
              dataType={"sales"}
              dataArray={salesUserData}
              onDelete={handelDelete}
              onSort={(key) => handelSorting(key, "sales")}
            />
          </div>
        )}
        {ondSales.length > 0 && (
          <div>
            <h2 className="text-xl mb-3 mt-10">Ägda försäljningar</h2>
            <TablesComponent
              dataType={"sales"}
              dataArray={ondSales}
              onDelete={handelDelete}
              onSort={(key) => handelSorting(key, "owned")}
            />
          </div>
        )}
      </div>
      {errorMessage && <ErrorHandler error={errorMessage} />}
    </div>
  );
}
